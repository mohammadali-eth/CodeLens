import { Component, inject, OnInit, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { ThemeManagerService } from '../../services/theme-manager.service';
import { SettingsSectionComponent } from '../settings-section/settings-section.component';
import { PreferenceCardComponent } from '../preference-card/preference-card.component';
import { ThemeSelectorComponent } from './theme-selector.component';
import { ThemeMode, AppearancePreferences, DEFAULT_USER_SETTINGS } from '../../models/user-settings.interface';

/**
 * AppearanceSettingsComponent
 * Purpose: Enterprise visual settings control panel for themes, typography scaling, editor fonts, syntax highlighters, and compact layout.
 * Responsibilities: Real-time UI live previewing, reactive form state binding, and database preference synchronization.
 * Dependencies: SettingsService, ThemeManagerService, ThemeSelectorComponent, PreferenceCardComponent.
 */
@Component({
  selector: 'app-appearance-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SettingsSectionComponent,
    PreferenceCardComponent,
    ThemeSelectorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-settings-section
      title="Appearance & Visual Customization"
      description="Customize your interface theme, typography scaling, code editor font family, syntax highlighter, and compact layout density."
      icon="palette"
      [isSaveable]="true"
      [saving]="service.saving()"
      (save)="onSubmit()"
      (reset)="onReset()"
    >
      <!-- Theme Selection Grid -->
      <div class="theme-selection-block">
        <label class="block-label">APPLICATION THEME MODE</label>
        <app-theme-selector
          [selectedTheme]="form.get('theme')?.value"
          (themeSelect)="onThemeChange($event)"
        ></app-theme-selector>
      </div>

      <form [formGroup]="form" class="settings-form">
        <!-- Font Scale -->
        <app-preference-card
          label="Interface Font Scale"
          description="Adjust global font size across navigation menus, sidebars, forms, tables, and card panels."
          icon="type"
        >
          <select class="form-select" formControlName="fontSize" (change)="onLivePreview()">
            <option value="small">Small (13px)</option>
            <option value="medium">Medium (14px Default)</option>
            <option value="large">Large (16px)</option>
            <option value="xl">Extra Large (18px)</option>
          </select>
        </app-preference-card>

        <!-- Editor Font Family -->
        <app-preference-card
          label="Code Editor Font"
          description="Monospaced typography applied to diff viewers, code blocks, and analysis viewports."
          icon="code"
        >
          <select class="form-select" formControlName="editorFont" (change)="onLivePreview()">
            <option value="'Fira Code', monospace">Fira Code (With Ligatures)</option>
            <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
            <option value="'Source Code Pro', monospace">Source Code Pro</option>
            <option value="'Cascadia Code', monospace">Cascadia Code</option>
            <option value="Monaco, monospace">Monaco</option>
            <option value="Menlo, monospace">Menlo</option>
          </select>
        </app-preference-card>

        <!-- Editor Syntax Color Theme -->
        <app-preference-card
          label="Code Syntax Theme"
          description="Color scheme applied to syntax highlighting within code review viewports."
          icon="palette"
        >
          <select class="form-select" formControlName="editorTheme" (change)="onLivePreview()">
            <option value="vs-dark">VS Code Dark Plus</option>
            <option value="one-dark">One Dark Pro</option>
            <option value="github-dark">GitHub Dark Default</option>
            <option value="github-light">GitHub Light</option>
            <option value="monokai">Monokai Pro</option>
            <option value="solarized-light">Solarized Light</option>
          </select>
        </app-preference-card>

        <!-- Compact Mode Toggle -->
        <app-preference-card
          label="Compact Layout Mode"
          description="Reduces vertical paddings, margins, and table row heights to maximize visible content density."
          icon="type"
        >
          <label class="switch-toggle">
            <input type="checkbox" formControlName="compactMode" (change)="onLivePreview()" />
            <span class="slider"></span>
          </label>
        </app-preference-card>
      </form>
    </app-settings-section>
  `,
  styles: [`
    .theme-selection-block {
      margin-bottom: 24px;
    }

    .block-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-subtle, #9ca3af);
      margin-bottom: 12px;
    }

    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
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
export class AppearanceSettingsComponent implements OnInit {
  readonly service = inject(SettingsService);
  readonly themeManager = inject(ThemeManagerService);
  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    theme: ['dark'],
    fontSize: ['medium'],
    editorFont: ["'Fira Code', monospace"],
    editorTheme: ['vs-dark'],
    compactMode: [false],
  });

  constructor() {
    effect(() => {
      const s = this.service.settings();
      if (s && s.appearance) {
        this.form.patchValue(s.appearance, { emitEvent: false });
        this.themeManager.applyPreferences(s.appearance);
      }
    });
  }

  ngOnInit(): void {
    const s = this.service.settings();
    if (s && s.appearance) {
      this.form.patchValue(s.appearance);
      this.themeManager.applyPreferences(s.appearance);
    }
  }

  onThemeChange(theme: ThemeMode): void {
    this.form.patchValue({ theme });
    this.themeManager.setTheme(theme);
    this.onLivePreview();
  }

  onLivePreview(): void {
    const val: AppearancePreferences = this.form.value;
    this.themeManager.applyPreferences(val);
  }

  onSubmit(): void {
    const pref: AppearancePreferences = this.form.value;
    this.themeManager.applyPreferences(pref);
    this.service.updateSettings({
      appearance: pref,
    }).subscribe();
  }

  onReset(): void {
    if (confirm('Are you sure you want to reset all appearance preferences to factory default?')) {
      const defaults = DEFAULT_USER_SETTINGS.appearance;
      this.form.reset(defaults);
      this.themeManager.applyPreferences(defaults);
      this.service.updateSettings({
        appearance: defaults,
      }).subscribe();
    }
  }
}
