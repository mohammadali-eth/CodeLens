import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  EditorPreferences,
  WordWrapOption,
  LineNumbersOption,
  AutoSaveOption,
  CursorStyleOption,
  ShowWhitespaceOption,
} from '../models/user-settings.interface';

/**
 * EditorManagerService
 * Purpose: Enterprise reactive state controller for code editor viewports across CodeLens.
 * Responsibilities:
 *  - Manages editor Signals (wordWrap, minimap, lineNumbers, autoSave, tabSize, fontSize, defaultLanguage, etc.)
 *  - Applies CSS variables and root HTML data-attributes to drive global editor CSS rules in real time
 *  - Provides standard configuration contracts for Monaco Editor and custom code viewports
 * Dependencies: Angular Signal API, PLATFORM_ID.
 */
@Injectable({
  providedIn: 'root',
})
export class EditorManagerService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Reactive Editor Preferences Signals
  readonly wordWrap = signal<WordWrapOption>('on');
  readonly minimap = signal<boolean>(true);
  readonly lineNumbers = signal<LineNumbersOption>('on');
  readonly autoSave = signal<AutoSaveOption>('afterDelay');
  readonly tabSize = signal<number>(2);
  readonly fontFamily = signal<string>("'Fira Code', monospace");
  readonly fontSize = signal<number>(14);
  readonly defaultLanguage = signal<string>('typescript');
  readonly cursorStyle = signal<CursorStyleOption>('line');
  readonly showWhitespace = signal<ShowWhitespaceOption>('selection');
  readonly renderIndentGuides = signal<boolean>(true);
  readonly codeLens = signal<boolean>(true);
  readonly bracketPairColorization = signal<boolean>(true);

  constructor() {
    if (this.isBrowser) {
      this.initFromCache();

      // Reactive DOM Synchronization Effect
      effect(() => {
        const wrap = this.wordWrap();
        const mini = this.minimap();
        const lines = this.lineNumbers();
        const autoS = this.autoSave();
        const tabS = this.tabSize();
        const fontF = this.fontFamily();
        const fontS = this.fontSize();
        const lang = this.defaultLanguage();
        const cursor = this.cursorStyle();
        const whitespace = this.showWhitespace();
        const indentG = this.renderIndentGuides();
        const cLens = this.codeLens();
        const bracketColor = this.bracketPairColorization();

        this.applyToDom({
          wordWrap: wrap,
          minimap: mini,
          lineNumbers: lines,
          autoSave: autoS,
          tabSize: tabS,
          fontFamily: fontF,
          fontSize: fontS,
          defaultLanguage: lang,
          cursorStyle: cursor,
          showWhitespace: whitespace,
          renderIndentGuides: indentG,
          codeLens: cLens,
          bracketPairColorization: bracketColor,
        });
      });
    }
  }

  /**
   * Apply partial or full EditorPreferences to reactive signals & DOM
   */
  applyPreferences(pref: Partial<EditorPreferences>): void {
    if (pref.wordWrap !== undefined) this.wordWrap.set(pref.wordWrap);
    if (pref.minimap !== undefined) this.minimap.set(pref.minimap);
    if (pref.lineNumbers !== undefined) this.lineNumbers.set(pref.lineNumbers);
    if (pref.autoSave !== undefined) this.autoSave.set(pref.autoSave);
    if (pref.tabSize !== undefined) this.tabSize.set(Number(pref.tabSize));
    if (pref.fontFamily) this.fontFamily.set(pref.fontFamily);
    if (pref.fontSize !== undefined) this.fontSize.set(Number(pref.fontSize));
    if (pref.defaultLanguage) this.defaultLanguage.set(pref.defaultLanguage);
    if (pref.cursorStyle) this.cursorStyle.set(pref.cursorStyle);
    if (pref.showWhitespace) this.showWhitespace.set(pref.showWhitespace);
    if (pref.renderIndentGuides !== undefined) this.renderIndentGuides.set(pref.renderIndentGuides);
    if (pref.codeLens !== undefined) this.codeLens.set(pref.codeLens);
    if (pref.bracketPairColorization !== undefined) this.bracketPairColorization.set(pref.bracketPairColorization);

    if (this.isBrowser) {
      this.saveToCache(pref);
    }
  }

  /**
   * Produce standardized Monaco Editor Options object
   */
  getMonacoOptions() {
    return {
      fontSize: this.fontSize(),
      fontFamily: this.fontFamily(),
      tabSize: this.tabSize(),
      wordWrap: this.wordWrap() === 'on' || this.wordWrap() === 'wordWrapColumn' || this.wordWrap() === 'bounded' ? this.wordWrap() : 'off',
      minimap: { enabled: this.minimap() },
      lineNumbers: this.lineNumbers() === 'off' ? 'off' : this.lineNumbers() === 'relative' ? 'relative' : 'on',
      cursorStyle: this.cursorStyle(),
      renderWhitespace: this.showWhitespace(),
      renderIndentGuides: this.renderIndentGuides(),
      codeLens: this.codeLens(),
      'bracketPairColorization.enabled': this.bracketPairColorization(),
    };
  }

  private initFromCache(): void {
    try {
      const cached = localStorage.getItem('codelens_editor_prefs');
      if (cached) {
        const parsed = JSON.parse(cached);
        this.applyPreferences(parsed);
      }
    } catch {
      // Ignore fallback cache errors
    }
  }

  private saveToCache(pref: Partial<EditorPreferences>): void {
    try {
      const existing = localStorage.getItem('codelens_editor_prefs');
      const current = existing ? JSON.parse(existing) : {};
      const merged = { ...current, ...pref };
      localStorage.setItem('codelens_editor_prefs', JSON.stringify(merged));
    } catch {
      // Ignore cache write errors
    }
  }

  private applyToDom(params: EditorPreferences): void {
    if (!this.isBrowser) return;

    const root = document.documentElement;

    // 1. CSS Variable Injections
    root.style.setProperty('--editor-font-size', `${params.fontSize}px`);
    root.style.setProperty('--editor-font-family', params.fontFamily);
    root.style.setProperty('--editor-tab-size', String(params.tabSize));

    // 2. DOM Attribute Injections for Universal CSS Targeting
    root.setAttribute('data-editor-word-wrap', params.wordWrap);
    root.setAttribute('data-editor-minimap', String(params.minimap));
    root.setAttribute('data-editor-line-numbers', params.lineNumbers);
    root.setAttribute('data-editor-auto-save', params.autoSave);
    root.setAttribute('data-editor-tab-size', String(params.tabSize));
    root.setAttribute('data-editor-font-size', `${params.fontSize}px`);
    root.setAttribute('data-editor-font-family', params.fontFamily);
    root.setAttribute('data-editor-default-language', params.defaultLanguage);
    root.setAttribute('data-editor-cursor-style', params.cursorStyle || 'line');
    root.setAttribute('data-editor-show-whitespace', params.showWhitespace || 'selection');
    root.setAttribute('data-editor-render-indent-guides', String(params.renderIndentGuides ?? true));
  }
}
