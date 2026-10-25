import { Injectable, signal } from '@angular/core';

export type ThemeId = 'midnight' | 'graphite' | 'ink' | 'paper-dusk' | 'sage';

export interface ThemeOption {
  id: ThemeId;
  label: string;
  /** Page background; also used for the browser's theme-color */
  bg: string;
  /** Accent colour, shown in the picker swatch */
  accent: string;
}

/** Keep in sync with the colour map in index.html and the token blocks in styles.css */
export const THEMES: ThemeOption[] = [
  { id: 'midnight', label: 'Midnight', bg: '#0A0A0A', accent: '#EDEDED' },
  { id: 'graphite', label: 'Warm graphite', bg: '#141210', accent: '#E8A15A' },
  { id: 'ink', label: 'Deep ink', bg: '#0B1020', accent: '#8EA2FF' },
  { id: 'sage', label: 'Sage', bg: '#0C1311', accent: '#9FE0C0' },
  { id: 'paper-dusk', label: 'Paper dusk', bg: '#CFCCC5', accent: '#1A1917' }
];

const STORAGE_KEY = 'sygnals-theme';

/**
 * Colour theme picker.
 * index.html applies the initial theme before boot; this service reads it and owns changes after that.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {

  readonly themes = THEMES;
  readonly theme = signal<ThemeId>(this.readInitial());

  set(id: ThemeId): void {
    const option = THEMES.find(t => t.id === id);
    if (!option) return;

    this.theme.set(id);
    document.documentElement.setAttribute('data-theme', id);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', option.bg);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch { }
  }

  private readInitial(): ThemeId {
    const current = document.documentElement.getAttribute('data-theme');
    return THEMES.find(t => t.id === current)?.id ?? 'midnight';
  }
}
