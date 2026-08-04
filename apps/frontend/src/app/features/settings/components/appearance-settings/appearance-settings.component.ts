import { Component, inject, OnInit, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { ThemeManagerService } from '../../services/theme-manager.service';
import { SettingsSectionComponent } from '../settings-section/settings-section.component';
import { PreferenceCardComponent } from '../preference-card/preference-card.component';
import { ThemeSelectorComponent } from './theme-selector.component';
import { ThemeMode, AppearancePreferences } from '../../models/user-settings.interface';

/**
 * AppearanceSettingsComponent
 * Purpose: Allows users to configure visual themes, font sizes, editor themes, and compact layout mode.
 * Responsibilities: Form state binding, real-time ThemeManagerService updates, and backend settings persistence.
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
      description="Choose your interface theme, editor font family, text scaling, and compact layout."
      icon="palette"
      [isSaveable]="true"
      [saving]="service.saving()"
      (save)="onSubmit()"
      (reset)="onReset()"
    >
      <!-- Theme Selection Grid -->
      <div class="theme-selection-block">
        <label class="block-label">APPLICATION THEME</label>
        <app-theme-selector
          [selectedTheme]="form.get('theme')?.value"
          (themeSelect)="onThemeChange($event)"
        ></app-theme-selector>
      </div>

      <form [formGroup]="form" class="settings-form">
        <!-- Font Size -->
        <app-preference-card
          label="Interface Font Scale"
          description="Adjust global font size across navigation menus, sidebar elements, and cards."
          icon="type"
        >
          <select class="form-select" formControlName="fontSize" (change)="onLivePreview()">
            <option value="small">Small (13px)</option>
            <option value="medium">Medium (14px Default)</option>
            <option value="large">Large (16px)</option>
          </select>
        </app-preference-card>

        <!-- Editor Font Family -->
        <app-preference-card
          label="Code Editor Font"
          description="Font family used for rendering diff viewers and code snippets."
          icon="code"
        >
          <select class="form-select" formControlName="editorFont">
            <option value="'Fira Code', monospace">Fira Code (With Ligatures)</option>
            <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
            <option value="Consolas, monospace">Consolas</option>
            <option value="'Source Code Pro', monospace">Source Code Pro</option>
          </select>
        </app-preference-card>

        <!-- Editor Color Theme -->
        <app-preference-card
          label="Code Syntax Theme"
          description="Color scheme applied to syntax highlighting within code review viewports."
          icon="palette"
        >
          <select class="form-select" formControlName="editorTheme">
            <option value="vs-dark">VS Code Dark Plus</option>
            <option value="one-dark">One Dark Pro</option>
            <option value="github-dark">GitHub Dark Default</option>
            <option value="github-light">GitHub Light</option>
            <option value="monokai">Monokai Pro</option>
          </select>
        </app-preference-card>

        <!-- Compact Mode -->
        <app-preference-card
          label="Compact Layout Mode"
          description="Reduces vertical margins and table paddings to fit more content on screen."
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
      margin-bottom: 20px;
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
      gap: 8px;
    }

    .form-select {
      width: 260px;
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
    theme: ['light'],
    fontSize: ['medium'],
    editorFont: ["'Fira Code', monospace"],
    editorTheme: ['vs-light'],
    compactMode: [false],
  });

  constructor() {
    effect(() => {
      const s = this.service.settings();
      if (s && s.appearance) {
        this.form.patchValue(s.appearance, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    const s = this.service.settings();
    if (s && s.appearance) {
      this.form.patchValue(s.appearance);
    }
  }

  onThemeChange(theme: ThemeMode): void {
    this.form.patchValue({ theme });
    this.themeManager.setTheme(theme);
  }

  onLivePreview(): void {
    const val: AppearancePreferences = this.form.value;
    this.themeManager.applyPreferences(val);
  }

  onSubmit(): void {
    this.service.updateSettings({
      appearance: this.form.value,
    }).subscribe();
  }

  onReset(): void {
    const s = this.service.settings();
    if (s && s.appearance) {
      this.form.reset(s.appearance);
      this.themeManager.applyPreferences(s.appearance);
    }
  }
}
