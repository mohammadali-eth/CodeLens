import { Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
import { EditorManagerService } from '../../services/editor-manager.service';
import { SettingsSectionComponent } from '../settings-section/settings-section.component';
import { PreferenceCardComponent } from '../preference-card/preference-card.component';
import { DEFAULT_USER_SETTINGS } from '../../models/user-settings.interface';

interface LanguageSnippet {
  title: string;
  lines: Array<{ num: string; tokens: Array<{ text: string; class?: string }> }>;
}

/**
 * EditorSettingsComponent
 * Purpose: Enterprise IDE settings interface for word wrap, minimap, line numbers, font sizing, language syntax, and auto-save.
 * Responsibilities: Real-time live code preview, instant global DOM style updates, and persistent backend synchronization.
 * Dependencies: SettingsService, EditorManagerService, ReactiveFormsModule.
 */
@Component({
  selector: 'app-editor-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SettingsSectionComponent,
    PreferenceCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-settings-section
      title="Code Editor Preferences"
      description="Configure workspace code viewports, indentation, line numbers, word wrap, and live syntax parameters."
      icon="code"
      [isSaveable]="true"
      [saving]="service.saving()"
      (save)="onSubmit()"
      (reset)="onReset()"
    >
      <!-- Live Code Snippet Preview Container -->
      <div class="editor-preview-card" [class.has-minimap]="form.get('minimap')?.value">
        <div class="preview-bar">
          <div class="preview-title-wrap">
            <span class="preview-dot red"></span>
            <span class="preview-dot yellow"></span>
            <span class="preview-dot green"></span>
            <span class="preview-title">Live Editor Viewport</span>
          </div>
          <span class="preview-lang">{{ (form.get('defaultLanguage')?.value || 'typescript') | uppercase }}</span>
        </div>

        <div class="preview-body">
          <div
            class="preview-code-block"
            [style.font-family]="form.get('fontFamily')?.value"
            [style.font-size.px]="form.get('fontSize')?.value"
            [style.tab-size]="form.get('tabSize')?.value"
            [class.wrap-on]="form.get('wordWrap')?.value === 'on'"
            [class.wrap-off]="form.get('wordWrap')?.value === 'off'"
            [class.wrap-col]="form.get('wordWrap')?.value === 'wordWrapColumn' || form.get('wordWrap')?.value === 'bounded'"
          >
            <ng-container *ngFor="let line of getActiveSnippetLines(); let i = index">
              <div class="line-row">
                <span class="line-num" *ngIf="form.get('lineNumbers')?.value !== 'off'">
                  {{ getLineNumberDisplay(i + 1) }}
                </span>
                <span class="line-text">
                  <ng-container *ngFor="let token of line.tokens">
                    <span [class]="token.class">{{ token.text }}</span>
                  </ng-container>
                </span>
              </div>
            </ng-container>
          </div>

          <!-- Minimap Gutter Simulation -->
          <div class="preview-minimap" *ngIf="form.get('minimap')?.value">
            <div class="minimap-line line-1"></div>
            <div class="minimap-line line-2"></div>
            <div class="minimap-line line-3"></div>
            <div class="minimap-line line-4"></div>
            <div class="minimap-line line-5"></div>
            <div class="minimap-viewport-slider"></div>
          </div>
        </div>
      </div>

      <form [formGroup]="form" class="settings-form">
        <!-- Word Wrap -->
        <app-preference-card
          label="Word Wrap"
          description="Controls how long lines of code wrap in the editor, workspace, and diff viewer."
          icon="code"
        >
          <select class="form-select" formControlName="wordWrap">
            <option value="on">On (Wrap lines at viewport edge)</option>
            <option value="off">Off (Never wrap lines)</option>
            <option value="wordWrapColumn">Wrap at Column 80</option>
            <option value="bounded">Bounded (Viewport & Column)</option>
          </select>
        </app-preference-card>

        <!-- Code Minimap Toggle -->
        <app-preference-card
          label="Code Minimap"
          description="Renders a high-level visual code minimap gutter on the right side of editor viewports."
          icon="code"
        >
          <label class="switch-toggle">
            <input type="checkbox" formControlName="minimap" />
            <span class="slider"></span>
          </label>
        </app-preference-card>

        <!-- Line Numbers -->
        <app-preference-card
          label="Line Numbers"
          description="Controls the display and formatting of line numbers in code views."
          icon="code"
        >
          <select class="form-select" formControlName="lineNumbers">
            <option value="on">On (Absolute Line Numbers)</option>
            <option value="off">Off (Hide Line Numbers)</option>
            <option value="relative">Relative (Line Offsets)</option>
            <option value="interval">Interval (Every 5 lines)</option>
          </select>
        </app-preference-card>

        <!-- Auto Save Mode -->
        <app-preference-card
          label="Auto Save Mode"
          description="Controls auto-saving behavior for code changes and draft reviews."
          icon="code"
        >
          <select class="form-select" formControlName="autoSave">
            <option value="afterDelay">After Delay (Save after 1000ms idle)</option>
            <option value="onFocusChange">On Focus Change (Save when switching tabs)</option>
            <option value="onWindowChange">On Window Change (Save on app blur)</option>
            <option value="off">Off (Manual Save Only)</option>
          </select>
        </app-preference-card>

        <!-- Tab Indentation Size -->
        <app-preference-card
          label="Tab Indentation Size"
          description="Number of spaces represented by a single tab press."
          icon="code"
        >
          <div class="radio-pill-group">
            <label class="radio-pill" [class.selected]="form.get('tabSize')?.value === 2">
              <input type="radio" formControlName="tabSize" [value]="2" />
              <span>2 Spaces</span>
            </label>
            <label class="radio-pill" [class.selected]="form.get('tabSize')?.value === 4">
              <input type="radio" formControlName="tabSize" [value]="4" />
              <span>4 Spaces</span>
            </label>
            <label class="radio-pill" [class.selected]="form.get('tabSize')?.value === 8">
              <input type="radio" formControlName="tabSize" [value]="8" />
              <span>8 Spaces</span>
            </label>
          </div>
        </app-preference-card>

        <!-- Editor Font Size Slider -->
        <app-preference-card
          label="Editor Font Size"
          description="Font size in pixels for code content and diff viewports (12px – 24px)."
          icon="type"
        >
          <div class="slider-control-group">
            <input
              type="range"
              class="range-input"
              min="12"
              max="24"
              step="1"
              formControlName="fontSize"
            />
            <span class="range-val">{{ form.get('fontSize')?.value }}px</span>
          </div>
        </app-preference-card>

        <!-- Code Editor Font Family -->
        <app-preference-card
          label="Font Family"
          description="Primary monospace font used across code viewports."
          icon="type"
        >
          <select class="form-select" formControlName="fontFamily">
            <option value="'Fira Code', monospace">Fira Code</option>
            <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
            <option value="'Source Code Pro', monospace">Source Code Pro</option>
            <option value="'Roboto Mono', monospace">Roboto Mono</option>
            <option value="ui-monospace, monospace">System Monospace</option>
          </select>
        </app-preference-card>

        <!-- Default Programming Language -->
        <app-preference-card
          label="Default Language Mode"
          description="Default syntax highlighter used when opening unclassified code files."
          icon="code"
        >
          <select class="form-select" formControlName="defaultLanguage">
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="php">PHP</option>
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="sql">SQL</option>
            <option value="markdown">Markdown</option>
          </select>
        </app-preference-card>

        <!-- Cursor Style -->
        <app-preference-card
          label="Cursor Style"
          description="Controls the visual appearance of the editor insertion cursor."
          icon="type"
        >
          <select class="form-select" formControlName="cursorStyle">
            <option value="line">Line (Vertical Line)</option>
            <option value="block">Block (Solid Box)</option>
            <option value="underline">Underline (Horizontal Bar)</option>
            <option value="line-thin">Line Thin (1px Vertical Line)</option>
          </select>
        </app-preference-card>

        <!-- Render Whitespace -->
        <app-preference-card
          label="Render Whitespace"
          description="Renders subtle symbols for space and tab characters."
          icon="code"
        >
          <select class="form-select" formControlName="showWhitespace">
            <option value="selection">Selection (Render on selected text)</option>
            <option value="none">None (Hide whitespace symbols)</option>
            <option value="boundary">Boundary (Render trailing/multiple spaces)</option>
            <option value="all">All (Render all whitespace symbols)</option>
          </select>
        </app-preference-card>
      </form>
    </app-settings-section>
  `,
  styles: [`
    .editor-preview-card {
      background: #090d16;
      border: 1px solid var(--border-color, #1e293b);
      border-radius: var(--radius-lg, 12px);
      overflow: hidden;
      margin-bottom: 24px;
      box-shadow: var(--shadow-md);
      transition: all 0.2s ease;
    }

    .preview-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
    }

    .preview-title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .preview-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .preview-dot.red { background: #ef4444; }
    .preview-dot.yellow { background: #f59e0b; }
    .preview-dot.green { background: #10b981; }

    .preview-title {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: #94a3b8;
      margin-left: 4px;
    }

    .preview-lang {
      font-size: 0.6875rem;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: var(--radius-full);
      background: rgba(37, 99, 235, 0.2);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .preview-body {
      display: flex;
      position: relative;
      min-height: 160px;
    }

    .preview-code-block {
      flex: 1;
      padding: 16px;
      color: #f8fafc;
      line-height: 1.6;
      overflow-x: auto;
    }

    .preview-code-block.wrap-on {
      white-space: pre-wrap !important;
      word-break: break-all !important;
    }

    .preview-code-block.wrap-off {
      white-space: pre !important;
    }

    .preview-code-block.wrap-col {
      white-space: pre-wrap !important;
      max-width: 80ch;
    }

    .line-row {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .line-num {
      width: 24px;
      color: #475569;
      font-size: 0.8em;
      text-align: right;
      user-select: none;
      flex-shrink: 0;
    }

    .line-text {
      flex: 1;
    }

    /* Syntax Highlighting Tokens */
    .kw { color: #c084fc; font-weight: 600; }
    .cls { color: #38bdf8; font-weight: 600; }
    .fn { color: #facc15; }
    .type { color: #4ade80; }
    .val { color: #f472b6; }
    .str { color: #fb923c; }
    .cmnt { color: #64748b; font-style: italic; }

    /* Minimap Simulation Gutter */
    .preview-minimap {
      width: 60px;
      background: #030712;
      border-left: 1px solid #1e293b;
      padding: 12px 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;
      user-select: none;
    }

    .minimap-line {
      height: 3px;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.15);
    }
    .minimap-line.line-1 { width: 85%; background: #c084fc; }
    .minimap-line.line-2 { width: 95%; background: #38bdf8; }
    .minimap-line.line-3 { width: 70%; background: #facc15; }
    .minimap-line.line-4 { width: 60%; background: #4ade80; }
    .minimap-line.line-5 { width: 40%; background: #fb923c; }

    .minimap-viewport-slider {
      position: absolute;
      top: 8px; left: 2px; right: 2px;
      height: 48px;
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.4);
      border-radius: 4px;
    }

    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-select {
      width: 280px;
      background: var(--bg-surface, #ffffff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      padding: 8px 12px;
      color: var(--text-primary, #111827);
      font-size: 0.875rem;
      outline: none;
      cursor: pointer;
      box-shadow: var(--shadow-xs);
      transition: all 0.15s ease;
    }

    .form-select:hover {
      border-color: var(--border-medium, #d1d5db);
    }

    .form-select:focus {
      border-color: var(--color-primary, #2563eb);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    .form-select option {
      background: #ffffff;
      color: #111827;
    }

    .radio-pill-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .radio-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      background: var(--bg-surface, #ffffff);
      border: 1px solid var(--border-color, #e5e7eb);
      color: var(--text-secondary, #4b5563);
      font-size: 0.8125rem;
      cursor: pointer;
      box-shadow: var(--shadow-xs);
      transition: all 0.15s ease;
    }

    .radio-pill input {
      display: none;
    }

    .radio-pill:hover {
      border-color: var(--border-medium, #d1d5db);
      background: var(--bg-surface-secondary, #f1f5f9);
    }

    .radio-pill.selected {
      background: var(--color-primary-light, #eff6ff);
      border-color: var(--color-primary-border, rgba(37, 99, 235, 0.25));
      color: var(--color-primary, #2563eb);
      font-weight: 600;
    }

    .slider-control-group {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 240px;
    }

    .range-input {
      flex: 1;
      accent-color: var(--color-primary, #2563eb);
    }

    .range-val {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-primary, #2563eb);
      width: 40px;
      text-align: right;
    }

    .switch-toggle {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }

    .switch-toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: #cbd5e1;
      transition: 0.2s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: #ffffff;
      transition: 0.2s;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    input:checked + .slider {
      background-color: var(--color-primary, #2563eb);
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }
  `],
})
export class EditorSettingsComponent implements OnInit, OnDestroy {
  readonly service = inject(SettingsService);
  private readonly editorManager = inject(EditorManagerService);
  private readonly fb = inject(FormBuilder);

  private formSub?: Subscription;

  readonly form: FormGroup = this.fb.group({
    wordWrap: ['on'],
    minimap: [true],
    lineNumbers: ['on'],
    autoSave: ['afterDelay'],
    tabSize: [2],
    fontFamily: ["'Fira Code', monospace"],
    fontSize: [14],
    defaultLanguage: ['typescript'],
    cursorStyle: ['line'],
    showWhitespace: ['selection'],
  });

  private readonly snippets: Record<string, LanguageSnippet> = {
    typescript: {
      title: 'TypeScript',
      lines: [
        { num: '1', tokens: [{ text: '// CodeLens AI Code Reviewer', class: 'cmnt' }] },
        { num: '2', tokens: [{ text: 'export class ', class: 'kw' }, { text: 'ReviewAnalyzer', class: 'cls' }, { text: ' {' }] },
        { num: '3', tokens: [{ text: '  async ', class: 'kw' }, { text: 'analyzeCode', class: 'fn' }, { text: '(file: ' }, { text: 'ReviewFile', class: 'type' }, { text: '): ' }, { text: 'Promise', class: 'type' }, { text: '<' }, { text: 'AnalysisResult', class: 'type' }, { text: '> {' }] },
        { num: '4', tokens: [{ text: '    const ', class: 'kw' }, { text: 'score = ' }, { text: 'await ', class: 'kw' }, { text: 'this', class: 'val' }, { text: '.' }, { text: 'computeQualityScore', class: 'fn' }, { text: '(file);' }] },
        { num: '5', tokens: [{ text: '    return ', class: 'kw' }, { text: '{ score, status: ' }, { text: "'COMPLETED'", class: 'str' }, { text: ' };' }] },
        { num: '6', tokens: [{ text: '  }' }] },
        { num: '7', tokens: [{ text: '}' }] },
      ],
    },
    javascript: {
      title: 'JavaScript',
      lines: [
        { num: '1', tokens: [{ text: '// CodeLens AI Review Engine', class: 'cmnt' }] },
        { num: '2', tokens: [{ text: 'async function ', class: 'kw' }, { text: 'analyzeCode', class: 'fn' }, { text: '(file) {' }] },
        { num: '3', tokens: [{ text: '  const ', class: 'kw' }, { text: 'result = ' }, { text: 'await ', class: 'kw' }, { text: 'fetch', class: 'fn' }, { text: '(' }, { text: "'/api/reviews'", class: 'str' }, { text: ');' }] },
        { num: '4', tokens: [{ text: '  return ', class: 'kw' }, { text: 'await ', class: 'kw' }, { text: 'result.' }, { text: 'json', class: 'fn' }, { text: '();' }] },
        { num: '5', tokens: [{ text: '}' }] },
      ],
    },
    python: {
      title: 'Python',
      lines: [
        { num: '1', tokens: [{ text: '# CodeLens AI Code Reviewer', class: 'cmnt' }] },
        { num: '2', tokens: [{ text: 'def ', class: 'kw' }, { text: 'analyze_code', class: 'fn' }, { text: '(file_path: ' }, { text: 'str', class: 'type' }, { text: ') -> ' }, { text: 'dict', class: 'type' }, { text: ':' }] },
        { num: '3', tokens: [{ text: '    score = ' }, { text: 'compute_quality_score', class: 'fn' }, { text: '(file_path)' }] },
        { num: '4', tokens: [{ text: '    return ', class: 'kw' }, { text: '{"score": score, "status": ' }, { text: '"COMPLETED"', class: 'str' }, { text: '}' }] },
      ],
    },
    java: {
      title: 'Java',
      lines: [
        { num: '1', tokens: [{ text: '// CodeLens Enterprise Java Reviewer', class: 'cmnt' }] },
        { num: '2', tokens: [{ text: 'public class ', class: 'kw' }, { text: 'ReviewAnalyzer', class: 'cls' }, { text: ' {' }] },
        { num: '3', tokens: [{ text: '  public ', class: 'kw' }, { text: 'AnalysisResult', class: 'type' }, { text: ' ' }, { text: 'analyzeCode', class: 'fn' }, { text: '(' }, { text: 'ReviewFile', class: 'type' }, { text: ' file) {' }] },
        { num: '4', tokens: [{ text: '    return ', class: 'kw' }, { text: 'new ', class: 'kw' }, { text: 'AnalysisResult', class: 'cls' }, { text: '(' }, { text: '98', class: 'val' }, { text: ', ' }, { text: '"PASSED"', class: 'str' }, { text: ');' }] },
        { num: '5', tokens: [{ text: '  }' }] },
        { num: '6', tokens: [{ text: '}' }] },
      ],
    },
    cpp: {
      title: 'C++',
      lines: [
        { num: '1', tokens: [{ text: '// CodeLens AI C++ Reviewer', class: 'cmnt' }] },
        { num: '2', tokens: [{ text: '#include ', class: 'kw' }, { text: '<iostream>', class: 'str' }] },
        { num: '3', tokens: [{ text: 'auto ', class: 'kw' }, { text: 'analyzeCode', class: 'fn' }, { text: '(' }, { text: 'const ', class: 'kw' }, { text: 'std::string&', class: 'type' }, { text: ' code) {' }] },
        { num: '4', tokens: [{ text: '  return ', class: 'kw' }, { text: 'AnalysisResult', class: 'cls' }, { text: '{ .score = ' }, { text: '95', class: 'val' }, { text: ' };' }] },
        { num: '5', tokens: [{ text: '}' }] },
      ],
    },
    go: {
      title: 'Go',
      lines: [
        { num: '1', tokens: [{ text: '// CodeLens Go Review Engine', class: 'cmnt' }] },
        { num: '2', tokens: [{ text: 'package ', class: 'kw' }, { text: 'main', class: 'cls' }] },
        { num: '3', tokens: [{ text: 'func ', class: 'kw' }, { text: 'AnalyzeCode', class: 'fn' }, { text: '(file ' }, { text: 'string', class: 'type' }, { text: ') (*' }, { text: 'AnalysisResult', class: 'cls' }, { text: ', ' }, { text: 'error', class: 'type' }, { text: ') {' }] },
        { num: '4', tokens: [{ text: '  return ', class: 'kw' }, { text: '&' }, { text: 'AnalysisResult', class: 'cls' }, { text: '{Score: ' }, { text: '96', class: 'val' }, { text: '}, ' }, { text: 'nil', class: 'val' }] },
        { num: '5', tokens: [{ text: '}' }] },
      ],
    },
    rust: {
      title: 'Rust',
      lines: [
        { num: '1', tokens: [{ text: '// CodeLens Rust Memory Safety Auditor', class: 'cmnt' }] },
        { num: '2', tokens: [{ text: 'pub fn ', class: 'kw' }, { text: 'analyze_code', class: 'fn' }, { text: '(file: &' }, { text: 'str', class: 'type' }, { text: ') -> ' }, { text: 'Result', class: 'type' }, { text: '<' }, { text: 'AnalysisResult', class: 'cls' }, { text: ', ' }, { text: 'Error', class: 'type' }, { text: '> {' }] },
        { num: '3', tokens: [{ text: '    ' }, { text: 'Ok', class: 'val' }, { text: '(' }, { text: 'AnalysisResult', class: 'cls' }, { text: ' { score: ' }, { text: '99', class: 'val' }, { text: ' })' }] },
        { num: '4', tokens: [{ text: '}' }] },
      ],
    },
    php: {
      title: 'PHP',
      lines: [
        { num: '1', tokens: [{ text: '<?php', class: 'kw' }] },
        { num: '2', tokens: [{ text: '// CodeLens PHP Reviewer', class: 'cmnt' }] },
        { num: '3', tokens: [{ text: 'function ', class: 'kw' }, { text: 'analyzeCode', class: 'fn' }, { text: '(string ' }, { text: '$code', class: 'val' }, { text: '): ' }, { text: 'array', class: 'type' }, { text: ' {' }] },
        { num: '4', tokens: [{ text: '  return ', class: 'kw' }, { text: '[' }, { text: "'score'", class: 'str' }, { text: ' => ' }, { text: '94', class: 'val' }, { text: '];' }] },
        { num: '5', tokens: [{ text: '}' }] },
      ],
    },
    json: {
      title: 'JSON',
      lines: [
        { num: '1', tokens: [{ text: '{' }] },
        { num: '2', tokens: [{ text: '  "service": ' }, { text: '"CodeLens AI"', class: 'str' }, { text: ',' }] },
        { num: '3', tokens: [{ text: '  "version": ' }, { text: '"2.5.0"', class: 'str' }, { text: ',' }] },
        { num: '4', tokens: [{ text: '  "status": ' }, { text: '"ACTIVE"', class: 'str' }, { text: ',' }] },
        { num: '5', tokens: [{ text: '  "score": ' }, { text: '98', class: 'val' }] },
        { num: '6', tokens: [{ text: '}' }] },
      ],
    },
    yaml: {
      title: 'YAML',
      lines: [
        { num: '1', tokens: [{ text: '# CodeLens CI/CD Pipeline', class: 'cmnt' }] },
        { num: '2', tokens: [{ text: 'name: ', class: 'kw' }, { text: 'AI Review Pipeline', class: 'str' }] },
        { num: '3', tokens: [{ text: 'on: ', class: 'kw' }, { text: '[push, pull_request]', class: 'val' }] },
        { num: '4', tokens: [{ text: 'jobs:', class: 'kw' }] },
        { num: '5', tokens: [{ text: '  audit:', class: 'fn' }] },
        { num: '6', tokens: [{ text: '    runs-on: ', class: 'kw' }, { text: 'ubuntu-latest', class: 'str' }] },
      ],
    },
    sql: {
      title: 'SQL',
      lines: [
        { num: '1', tokens: [{ text: '-- CodeLens Telemetry Query', class: 'cmnt' }] },
        { num: '2', tokens: [{ text: 'SELECT ', class: 'kw' }, { text: 'review_id, score, status' }] },
        { num: '3', tokens: [{ text: 'FROM ', class: 'kw' }, { text: 'code_reviews' }] },
        { num: '4', tokens: [{ text: 'WHERE ', class: 'kw' }, { text: 'status = ' }, { text: "'COMPLETED'", class: 'str' }] },
        { num: '5', tokens: [{ text: 'ORDER BY ', class: 'kw' }, { text: 'created_at ' }, { text: 'DESC', class: 'kw' }, { text: ';' }] },
      ],
    },
    markdown: {
      title: 'Markdown',
      lines: [
        { num: '1', tokens: [{ text: '# CodeLens AI Code Review Report', class: 'kw' }] },
        { num: '2', tokens: [{ text: '## Quality Audit Summary', class: 'cls' }] },
        { num: '3', tokens: [{ text: '- **Status**: Passed', class: 'str' }] },
        { num: '4', tokens: [{ text: '- **Score**: `98/100`', class: 'val' }] },
        { num: '5', tokens: [{ text: 'All security checks passed.', class: 'cmnt' }] },
      ],
    },
  };

  ngOnInit(): void {
    // 1. Populate form from current settings store
    const s = this.service.settings();
    if (s && s.editor) {
      this.form.patchValue(s.editor, { emitEvent: false });
    }

    // 2. Subscribe to form value changes for instant real-time live preview & global DOM application
    this.formSub = this.form.valueChanges.subscribe((val) => {
      this.editorManager.applyPreferences(val);
    });
  }

  ngOnDestroy(): void {
    this.formSub?.unsubscribe();
  }

  getActiveSnippetLines() {
    const lang = this.form.get('defaultLanguage')?.value || 'typescript';
    return (this.snippets[lang] || this.snippets['typescript']).lines;
  }

  getLineNumberDisplay(index: number): string {
    const mode = this.form.get('lineNumbers')?.value;
    if (mode === 'relative') {
      return index === 1 ? '0' : String(index - 1);
    }
    if (mode === 'interval') {
      return index % 5 === 0 || index === 1 ? String(index) : '•';
    }
    return String(index);
  }

  onSubmit(): void {
    const updated = this.form.value;
    this.service.updateSettings({
      editor: updated,
    }).subscribe();
  }

  onReset(): void {
    const defaults = DEFAULT_USER_SETTINGS.editor;
    this.form.patchValue(defaults);
    this.editorManager.applyPreferences(defaults);
    this.service.updateSettings({
      editor: defaults,
    }).subscribe();
  }
}
