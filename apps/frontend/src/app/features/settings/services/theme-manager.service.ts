import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeMode, FontSizeOption, AppearancePreferences } from '../models/user-settings.interface';

/**
 * ThemeManagerService
 * Purpose: Enterprise DOM state manager for themes, font scaling, syntax highlighters, and compact layout rules.
 * Responsibilities: Real-time DOM attribute mutation, CSS variable injection, system media query listeners, and local caching.
 * Dependencies: Angular Signal API, PLATFORM_ID.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeManagerService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Signals State
  readonly themeMode = signal<ThemeMode>('dark');
  readonly fontSize = signal<FontSizeOption>('medium');
  readonly editorFont = signal<string>("'Fira Code', monospace");
  readonly editorTheme = signal<string>('vs-dark');
  readonly compactMode = signal<boolean>(false);
  readonly density = signal<'comfortable' | 'compact' | 'spacious'>('comfortable');
  readonly animations = signal<boolean>(true);
  readonly reducedMotion = signal<boolean>(false);

  // Computed Signal for System Dark/Light Resolution
  readonly effectiveTheme = computed<'light' | 'dark'>(() => {
    const current = this.themeMode();
    if (current === 'system') {
      return this.getSystemPreference();
    }
    return current;
  });

  constructor() {
    if (this.isBrowser) {
      this.initFromCache();
      this.listenToSystemChanges();

      // Reactive DOM Synchronization Effect
      effect(() => {
        const theme = this.effectiveTheme();
        const font = this.fontSize();
        const eFont = this.editorFont();
        const eTheme = this.editorTheme();
        const compact = this.compactMode();
        const dens = this.density();
        const anim = this.animations();
        const redMotion = this.reducedMotion();

        this.applyToDom({
          theme,
          fontSize: font,
          editorFont: eFont,
          editorTheme: eTheme,
          compactMode: compact,
          density: dens,
          animations: anim,
          reducedMotion: redMotion,
        });
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
    if (pref.theme) this.themeMode.set(pref.theme);
    if (pref.fontSize) this.fontSize.set(pref.fontSize);
    if (pref.editorFont) this.editorFont.set(pref.editorFont);
    if (pref.editorTheme) this.editorTheme.set(pref.editorTheme);
    if (pref.compactMode !== undefined) this.compactMode.set(pref.compactMode);
    if (pref.density) this.density.set(pref.density);
    if (pref.animations !== undefined) this.animations.set(pref.animations);
    if (pref.reducedMotion !== undefined) this.reducedMotion.set(pref.reducedMotion);

    if (this.isBrowser) {
      localStorage.setItem('codelens_theme', pref.theme);
      localStorage.setItem('codelens_font_size', pref.fontSize);
      localStorage.setItem('codelens_editor_font', pref.editorFont);
      localStorage.setItem('codelens_editor_theme', pref.editorTheme);
      localStorage.setItem('codelens_compact', String(pref.compactMode));
    }
  }

  private initFromCache(): void {
    const cachedTheme = localStorage.getItem('codelens_theme') as ThemeMode | null;
    const cachedFontSize = localStorage.getItem('codelens_font_size') as FontSizeOption | null;
    const cachedEditorFont = localStorage.getItem('codelens_editor_font');
    const cachedEditorTheme = localStorage.getItem('codelens_editor_theme');
    const cachedCompact = localStorage.getItem('codelens_compact');

    if (cachedTheme && ['light', 'dark', 'system'].includes(cachedTheme)) {
      this.themeMode.set(cachedTheme);
    }
    if (cachedFontSize && ['small', 'medium', 'large', 'xl'].includes(cachedFontSize)) {
      this.fontSize.set(cachedFontSize);
    }
    if (cachedEditorFont) {
      this.editorFont.set(cachedEditorFont);
    }
    if (cachedEditorTheme) {
      this.editorTheme.set(cachedEditorTheme);
    }
    if (cachedCompact !== null) {
      this.compactMode.set(cachedCompact === 'true');
    }
  }

  private getSystemPreference(): 'light' | 'dark' {
    if (this.isBrowser && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  }

  private listenToSystemChanges(): void {
    if (this.isBrowser && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => {
        if (this.themeMode() === 'system') {
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

  private applyToDom(params: {
    theme: 'light' | 'dark';
    fontSize: FontSizeOption;
    editorFont: string;
    editorTheme: string;
    compactMode: boolean;
    density: string;
    animations: boolean;
    reducedMotion: boolean;
  }): void {
    if (!this.isBrowser) return;

    const root = document.documentElement;
    const body = document.body;

    // 1. Theme Data Attribute & Body Class
    root.setAttribute('data-theme', params.theme);
    if (params.theme === 'dark') {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }

    // 2. Font Scale & CSS Variables
    root.setAttribute('data-font-size', params.fontSize);
    const fontScaleMap: Record<FontSizeOption, string> = {
      small: '13px',
      medium: '14px',
      large: '16px',
      xl: '18px',
    };
    root.style.setProperty('--app-font-scale', fontScaleMap[params.fontSize] || '14px');

    // 3. Code Editor Font Family
    root.setAttribute('data-editor-font', params.editorFont);
    root.style.setProperty('--editor-font-family', params.editorFont);

    // 4. Code Syntax Highlighting Theme
    root.setAttribute('data-syntax-theme', params.editorTheme);
    root.style.setProperty('--syntax-theme', params.editorTheme);

    // 5. Compact Layout Mode
    root.setAttribute('data-compact', String(params.compactMode));
    if (params.compactMode) {
      body.classList.add('compact-mode');
    } else {
      body.classList.remove('compact-mode');
    }

    // 6. Reduced Motion & Animations
    root.setAttribute('data-animations', String(params.animations));
    root.setAttribute('data-reduced-motion', String(params.reducedMotion));
  }
}
