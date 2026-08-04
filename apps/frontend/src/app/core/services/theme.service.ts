import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'codelens_theme';
  public currentTheme = signal<Theme>('light');

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      this.setTheme(savedTheme);
    } else {
      // Default to light theme as requested for enterprise SaaS look
      this.setTheme('light');
    }
  }

  public toggleTheme(): void {
    const nextTheme: Theme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
  }

  public setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
      }
    }
  }
}
