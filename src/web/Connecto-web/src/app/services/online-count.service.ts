import { Injectable, NgZone, inject, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../environments/environment.dev';

/** Disconnect this long after the tab is hidden. */
const HIDDEN_GRACE_MS = 30_000;
/** Disconnect after this long with no mouse, touch, key or scroll activity on a visible tab. */
const IDLE_TIMEOUT_MS = 5 * 60_000;

const ACTIVITY_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'] as const;

/**
 * Read-only hub connection used by the landing page to show how many people are online.
 * Kept separate from RandomChatSignalRService so it never interferes with the chat connection:
 * it only listens for ActiveUserCountUpdated and never registers or joins the queue.
 *
 * The connection is dropped while the tab is hidden or idle and reopened on return. An open
 * WebSocket counts as traffic, so a forgotten landing-page tab would otherwise keep a free-tier
 * backend awake around the clock and burn through its monthly instance hours.
 */
@Injectable({ providedIn: 'root' })
export class OnlineCountService {

  /** null until the server has reported a count, and while paused */
  readonly count = signal<number | null>(null);

  private readonly zone = inject(NgZone);
  private connection: signalR.HubConnection | null = null;
  private watching = false;
  private hiddenTimer?: ReturnType<typeof setTimeout>;
  private idleTimer?: ReturnType<typeof setTimeout>;

  private readonly onVisibilityChange = () => {
    clearTimeout(this.hiddenTimer);
    if (document.hidden) {
      this.hiddenTimer = setTimeout(() => void this.pause(), HIDDEN_GRACE_MS);
    } else {
      this.onActivity();
    }
  };

  private readonly onActivity = () => {
    if (document.hidden) return;
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => void this.pause(), IDLE_TIMEOUT_MS);
    if (!this.connection) this.zone.run(() => void this.start());
  };

  /** Connect now and keep the connection only while the page is visible and in use. */
  watch(): void {
    if (this.watching) return;
    this.watching = true;
    // Activity events fire constantly; listen outside Angular so they don't trigger change detection.
    this.zone.runOutsideAngular(() => {
      document.addEventListener('visibilitychange', this.onVisibilityChange);
      for (const e of ACTIVITY_EVENTS) window.addEventListener(e, this.onActivity, { passive: true });
    });
    this.onActivity();
  }

  /** Stop watching and close the connection (landing page destroyed). */
  async unwatch(): Promise<void> {
    if (!this.watching) return;
    this.watching = false;
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    for (const e of ACTIVITY_EVENTS) window.removeEventListener(e, this.onActivity);
    clearTimeout(this.hiddenTimer);
    clearTimeout(this.idleTimer);
    await this.stop();
  }

  async start(): Promise<void> {
    if (this.connection) return;

    const userId = uuidv4();
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiBaseUrl}/chathub`, {
        accessTokenFactory: () => userId,
        withCredentials: true
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.None)
      .build();
    this.connection = connection;

    connection.on('ActiveUserCountUpdated', (count: number) => this.count.set(count));

    try {
      await connection.start();
    } catch {
      // The count is decorative; the landing page simply hides it if the hub is unreachable.
      if (this.connection === connection) this.connection = null;
    }
  }

  async stop(): Promise<void> {
    const connection = this.connection;
    this.connection = null;
    this.count.set(null);
    try {
      await connection?.stop();
    } catch { }
  }

  private async pause(): Promise<void> {
    if (this.watching) await this.zone.run(() => this.stop());
  }
}
