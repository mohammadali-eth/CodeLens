import { Component, inject, OnInit, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { SettingsSectionComponent } from '../settings-section/settings-section.component';
import { PreferenceCardComponent } from '../preference-card/preference-card.component';
import { EditorPreferences } from '../../models/user-settings.interface';

/**
 * EditorSettingsComponent
 * Purpose: Configures code editor behaviors, word wrapping, minimap, line numbers, tab size, font family, and default language.
 * Responsibilities: Form management, live code snippet preview, and backend settings persistence.
 * Dependencies: SettingsService, ReactiveFormsModule, SettingsSectionComponent, PreferenceCardComponent.
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
      <!-- Live Code Snippet Preview -->
      <div class="editor-preview-card">
        <div class="preview-bar">
          <span class="preview-title">Live Editor Preview</span>
          <span class="preview-lang">{{ form.get('defaultLanguage')?.value | uppercase }}</span>
        </div>
        <div
          class="preview-code-block"
          [style.font-family]="form.get('fontFamily')?.value"
          [style.font-size.px]="form.get('fontSize')?.value"
          [style.tab-size]="form.get('tabSize')?.value"
        >
          <div class="line-row" *ngIf="form.get('lineNumbers')?.value !== 'off'">
            <span class="line-num">1</span>
            <span class="line-text"><span class="kw">export</span> <span class="kw">class</span> <span class="cls">ReviewAnalyzer</span> &#123;</span>
          </div>
          <div class="line-row" *ngIf="form.get('lineNumbers')?.value !== 'off'">
            <span class="line-num">2</span>
            <span class="line-text">&nbsp;&nbsp;<span class="kw">async</span> <span class="fn">analyzeCode</span>(file: <span class="type">ReviewFile</span>): <span class="type">Promise</span>&lt;<span class="type">AnalysisResult</span>&gt; &#123;</span>
          </div>
          <div class="line-row" *ngIf="form.get('lineNumbers')?.value !== 'off'">
            <span class="line-num">3</span>
            <span class="line-text">&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">const</span> score = <span class="kw">await</span> <span class="val">this</span>.<span class="fn">computeQualityScore</span>(file);</span>
          </div>
          <div class="line-row" *ngIf="form.get('lineNumbers')?.value !== 'off'">
            <span class="line-num">4</span>
            <span class="line-text">&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> &#123; score, status: <span class="str">'COMPLETED'</span> &#125;;</span>
          </div>
          <div class="line-row" *ngIf="form.get('lineNumbers')?.value !== 'off'">
            <span class="line-num">5</span>
            <span class="line-text">&nbsp;&nbsp;&#125;</span>
          </div>
          <div class="line-row" *ngIf="form.get('lineNumbers')?.value !== 'off'">
            <span class="line-num">6</span>
            <span class="line-text">&#125;</span>
          </div>
        </div>
      </div>

      <form [formGroup]="form" class="settings-form">
        <!-- Word Wrap -->
        <app-preference-card
          label="Word Wrap"
          description="Controls how long lines of code wrap in the editor and diff viewer."
          icon="code"
        >
          <select class="form-select" formControlName="wordWrap">
            <option value="on">On (Wrap lines at viewport edge)</option>
            <option value="off">Off (Never wrap lines)</option>
            <option value="wordWrapColumn">Wrap at Column</option>
          </select>
        </app-preference-card>

        <!-- Minimap Toggle -->
        <app-preference-card
          label="Code Minimap"
          description="Renders a high-level visual code minimap gutter on the right side of the editor."
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
            <option value="relative">Relative (Line Offset Numbers)</option>
          </select>
        </app-preference-card>

        <!-- Auto Save -->
        <app-preference-card
          label="Auto Save Mode"
          description="Controls auto-saving behavior for code changes and draft reviews."
          icon="code"
        >
          <select class="form-select" formControlName="autoSave">
            <option value="afterDelay">After Delay (Save after 1000ms idle)</option>
            <option value="onFocusChange">On Focus Change (Save when switching tabs)</option>
            <option value="off">Off (Manual Save Only)</option>
          </select>
        </app-preference-card>

        <!-- Tab Size -->
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
          description="Font size in pixels for code content and diff viewports."
          icon="type"
        >
          <div class="slider-control-group">
            <input
              type="range"
              class="range-input"
              min="11"
              max="22"
              step="1"
              formControlName="fontSize"
            />
            <span class="range-val">{{ form.get('fontSize')?.value }}px</span>
          </div>
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
            <option value="csharp">C#</option>
            <option value="php">PHP</option>
          </select>
        </app-preference-card>
      </form>
    </app-settings-section>
  `,
  styles: [`
    .editor-preview-card {
      background: #0f172a;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: var(--radius-lg, 12px);
      overflow: hidden;
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
    }

    .preview-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .preview-title {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: #94a3b8;
    }

    .preview-lang {
      font-size: 0.6875rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: var(--radius-full);
      background: var(--color-primary-light, #eff6ff);
      color: var(--color-primary, #2563eb);
    }

    .preview-code-block {
      padding: 16px;
      color: #f8fafc;
      line-height: 1.6;
      overflow-x: auto;
    }

    .line-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .line-num {
      width: 20px;
      color: #64748b;
      font-size: 0.8em;
      text-align: right;
      user-select: none;
    }

    .kw { color: #c084fc; font-weight: 600; }
    .cls { color: #38bdf8; }
    .fn { color: #facc15; }
    .type { color: #4ade80; }
    .val { color: #f472b6; }
    .str { color: #fb923c; }

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
export class EditorSettingsComponent implements OnInit {
  readonly service = inject(SettingsService);
  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    wordWrap: ['on'],
    minimap: [true],
    lineNumbers: ['on'],
    autoSave: ['afterDelay'],
    tabSize: [2],
    fontFamily: ["'Fira Code', monospace"],
    fontSize: [14],
    defaultLanguage: ['typescript'],
  });

  constructor() {
    effect(() => {
      const s = this.service.settings();
      if (s && s.editor) {
        this.form.patchValue(s.editor, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    const s = this.service.settings();
    if (s && s.editor) {
      this.form.patchValue(s.editor);
    }
  }

  onSubmit(): void {
    this.service.updateSettings({
      editor: this.form.value,
    }).subscribe();
  }

  onReset(): void {
    const s = this.service.settings();
    if (s && s.editor) {
      this.form.reset(s.editor);
    }
  }
}
