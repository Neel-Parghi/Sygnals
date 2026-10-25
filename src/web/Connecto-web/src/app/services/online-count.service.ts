import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../environments/environment.dev';

/**
 * Read-only hub connection used by the landing page to show how many people are online.
 * Kept separate from RandomChatSignalRService so it never interferes with the chat connection:
 * it only listens for ActiveUserCountUpdated and never registers or joins the queue.
 */
@Injectable({ providedIn: 'root' })
export class OnlineCountService {

  /** null until the server has reported a count */
  readonly count = signal<number | null>(null);

  private connection: signalR.HubConnection | null = null;

  async start(): Promise<void> {
    if (this.connection) return;

    const userId = uuidv4();
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiBaseUrl}/chathub`, {
        accessTokenFactory: () => userId,
        withCredentials: true
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.None)
      .build();

    this.connection.on('ActiveUserCountUpdated', (count: number) => this.count.set(count));

    try {
      await this.connection.start();
    } catch {
      // The count is decorative; the landing page simply hides it if the hub is unreachable.
      this.connection = null;
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
}
