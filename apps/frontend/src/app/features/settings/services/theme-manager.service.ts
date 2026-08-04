import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeMode, AppearancePreferences } from '../models/user-settings.interface';

/**
 * ThemeManagerService
 * Purpose: Manages DOM theme application, dark/light mode toggles, system color scheme listeners, and CSS variable injection.
 * Responsibilities: Real-time UI theme switching, LocalStorage caching, and document attribute mutation.
 * Dependencies: Angular Signal API, PLATFORM_ID.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeManagerService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly themeMode = signal<ThemeMode>('light');
  readonly compactMode = signal<boolean>(false);
  readonly fontSize = signal<'small' | 'medium' | 'large'>('medium');

  readonly effectiveTheme = computed<'light' | 'dark'>(() => {
    const current = this.themeMode();
    if (current === 'system') {
      return this.getSystemPreference();
    }
    return current;
  });

  constructor() {
    if (this.isBrowser) {
      this.initThemeFromCache();
      this.listenToSystemChanges();

      // Reactive DOM Synchronization Effect
      effect(() => {
        const theme = this.effectiveTheme();
        const compact = this.compactMode();
        const size = this.fontSize();

        this.applyThemeToDom(theme, compact, size);
      });
    }
  }

  setTheme(theme: ThemeMode): void {
    this.themeMode.set(theme);
    if (this.isBrowser) {
      localStorage.setItem('codelens_theme', theme);
    }
  }

  applyPreferences(pref: AppearancePreferences): void {
    this.themeMode.set(pref.theme);
    this.compactMode.set(pref.compactMode);
    this.fontSize.set(pref.fontSize);
    if (this.isBrowser) {
      localStorage.setItem('codelens_theme', pref.theme);
      localStorage.setItem('codelens_compact', String(pref.compactMode));
      localStorage.setItem('codelens_font_size', pref.fontSize);
    }
  }

  private initThemeFromCache(): void {
    const cachedTheme = localStorage.getItem('codelens_theme') as ThemeMode | null;
    const cachedCompact = localStorage.getItem('codelens_compact');
    const cachedFontSize = localStorage.getItem('codelens_font_size') as 'small' | 'medium' | 'large' | null;

    if (cachedTheme && ['light', 'dark', 'system'].includes(cachedTheme)) {
      this.themeMode.set(cachedTheme);
    } else {
      this.themeMode.set('light');
    }
    if (cachedCompact !== null) {
      this.compactMode.set(cachedCompact === 'true');
    }
    if (cachedFontSize && ['small', 'medium', 'large'].includes(cachedFontSize)) {
      this.fontSize.set(cachedFontSize);
    }
  }

  private getSystemPreference(): 'light' | 'dark' {
    if (this.isBrowser && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  private listenToSystemChanges(): void {
    if (this.isBrowser && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => {
        if (this.themeMode() === 'system') {
          // Trigger signal update by re-evaluating system preference
          this.themeMode.set('system');
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
      } else {
        mediaQuery.addListener(listener);
      }
    }
  }

  private applyThemeToDom(
    theme: 'light' | 'dark',
    compact: boolean,
    fontSize: 'small' | 'medium' | 'large'
  ): void {
    if (!this.isBrowser) return;

    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-theme', theme);
    root.setAttribute('data-font-size', fontSize);

    if (theme === 'dark') {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }

    if (compact) {
      body.classList.add('compact-mode');
    } else {
      body.classList.remove('compact-mode');
    }
  }
}
