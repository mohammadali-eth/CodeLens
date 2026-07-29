import { storageService } from './storage.service';

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * ThemeService
 * Purpose: Manages application theme selection (light, dark, system), DOM attribute synchronization, and storage persistence.
 * Responsibilities: Theme switching, OS media query listener synchronization, and storage persistence.
 * Dependencies: StorageService.
 */

export class ThemeService {
  private static instance: ThemeService;
  private readonly THEME_STORAGE_KEY = 'codelens_admin_theme_mode';
  private currentMode: ThemeMode = 'dark';

  private constructor() {
    this.initTheme();
  }

  public static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  public initTheme(): void {
    const savedTheme = storageService.getItem<ThemeMode>(this.THEME_STORAGE_KEY);
    this.currentMode = savedTheme || 'dark';
    this.applyTheme(this.currentMode);

    // Listen for OS system theme changes if system mode is selected
    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.currentMode === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  public setTheme(mode: ThemeMode): void {
    this.currentMode = mode;
    storageService.setItem(this.THEME_STORAGE_KEY, mode);
    this.applyTheme(mode);
  }

  public getTheme(): ThemeMode {
    return this.currentMode;
  }

  private applyTheme(mode: ThemeMode): void {
    let activeTheme: 'light' | 'dark' = 'light';

    if (mode === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      activeTheme = prefersDark ? 'dark' : 'light';
    } else {
      activeTheme = mode;
    }

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', activeTheme);
      document.documentElement.classList.remove('light-theme', 'dark-theme');
      document.documentElement.classList.add(`${activeTheme}-theme`);
    }
  }
}

export const themeService = ThemeService.getInstance();
