import { Component, inject, OnInit, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { SettingsSectionComponent } from '../settings-section/settings-section.component';
import { PreferenceCardComponent } from '../preference-card/preference-card.component';
import { AIPreferences } from '../../models/user-settings.interface';

/**
 * AiSettingsComponent
 * Purpose: Configures AI review model selection, severity level, scan passes, and custom system prompts.
 * Responsibilities: Form state management, model capability badges display, and backend updates.
 * Dependencies: SettingsService, ReactiveFormsModule, SettingsSectionComponent, PreferenceCardComponent.
 */
@Component({
  selector: 'app-ai-settings',
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
      title="AI Review Engine & Behavior"
      description="Configure model architecture, response detail level, streaming options, and review behavior."
      icon="psychology"
      [isSaveable]="true"
      [saving]="service.saving()"
      (save)="onSubmit()"
      (reset)="onReset()"
    >
      <form [formGroup]="form" class="settings-form">
        <!-- AI Provider Selection -->
        <app-preference-card
          label="Default AI Engine Provider"
          description="Select the primary AI cloud infrastructure vendor for code review analysis."
          icon="cpu"
        >
          <select class="form-select" formControlName="defaultAIProvider">
            <option value="gemini">Google Gemini AI</option>
            <option value="openai">OpenAI Enterprise</option>
            <option value="anthropic">Anthropic Claude AI</option>
          </select>
        </app-preference-card>

        <!-- AI Model Selection -->
        <app-preference-card
          label="Primary Model Architecture"
          description="Specific model version used to process pull requests and generate code feedback."
          icon="cpu"
        >
          <div class="model-select-wrapper">
            <select class="form-select" formControlName="defaultAIModel">
              <option value="gemini-2.5-pro">Gemini 2.5 Pro (Ultra Fast & Accurate)</option>
              <option value="gpt-4o">OpenAI GPT-4o (Multi-Modal Leader)</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Superior Coding Reasoning)</option>
            </select>
            <div class="model-badge-row">
              <span class="cap-chip" *ngIf="form.get('defaultAIModel')?.value === 'claude-3-5-sonnet'">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Recommended for Refactoring
              </span>
              <span class="cap-chip" *ngIf="form.get('defaultAIModel')?.value === 'gemini-2.5-pro'">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                2,000,000 Token Context
              </span>
            </div>
          </div>
        </app-preference-card>

        <!-- Detail Level -->
        <app-preference-card
          label="Response Detail Level"
          description="Controls how verbose AI review explanations and code recommendations are."
          icon="shield"
        >
          <div class="radio-pill-group">
            <label class="radio-pill" [class.selected]="form.get('responseDetailLevel')?.value === 'concise'">
              <input type="radio" formControlName="responseDetailLevel" value="concise" />
              <span>Concise (Bullet Points)</span>
            </label>

            <label class="radio-pill" [class.selected]="form.get('responseDetailLevel')?.value === 'balanced'">
              <input type="radio" formControlName="responseDetailLevel" value="balanced" />
              <span>Balanced (Standard)</span>
            </label>

            <label class="radio-pill" [class.selected]="form.get('responseDetailLevel')?.value === 'exhaustive'">
              <input type="radio" formControlName="responseDetailLevel" value="exhaustive" />
              <span>Exhaustive (Full Context)</span>
            </label>
          </div>
        </app-preference-card>

        <!-- Preferred Explanation Style -->
        <app-preference-card
          label="Explanation Focus Style"
          description="Tailor AI review focus toward architecture, security, or clean code implementations."
          icon="psychology"
        >
          <select class="form-select" formControlName="preferredExplanationStyle">
            <option value="architectural">Architectural & SOLID Focus</option>
            <option value="security-first">Security-First & OWASP Vulnerabilities</option>
            <option value="code-only">Code Snippets & Refactoring Only</option>
            <option value="step-by-step">Step-by-Step Educational</option>
          </select>
        </app-preference-card>

        <!-- Streaming Responses -->
        <app-preference-card
          label="Streaming AI Token Output"
          description="Stream AI reasoning token responses in real-time as they generate."
          icon="cpu"
        >
          <label class="switch-toggle">
            <input type="checkbox" formControlName="streamingResponses" />
            <span class="slider"></span>
          </label>
        </app-preference-card>

        <!-- Auto Analyze -->
        <app-preference-card
          label="Automatic Pull Request Review"
          description="Trigger automated AI code review generation immediately upon PR creation or updates."
          icon="bell"
        >
          <label class="switch-toggle">
            <input type="checkbox" formControlName="autoAnalyze" />
            <span class="slider"></span>
          </label>
        </app-preference-card>

        <!-- Temperature Slider -->
        <app-preference-card
          label="Model Temperature (Creativity)"
          description="Lower values (0.0 - 0.3) produce deterministic, precise reviews. Higher values increase variability."
          icon="tune"
        >
          <div class="slider-control-group">
            <input
              type="range"
              class="range-input"
              min="0.0"
              max="1.0"
              step="0.05"
              formControlName="temperature"
            />
            <span class="range-val">{{ form.get('temperature')?.value }}</span>
          </div>
        </app-preference-card>
      </form>
    </app-settings-section>
  `,
  styles: [`
    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .model-select-wrapper {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 320px;
    }

    .form-select {
      width: 100%;
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

    .model-badge-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .cap-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.71875rem;
      font-weight: 600;
      color: var(--color-primary, #2563eb);
      background: var(--color-primary-light, #eff6ff);
      border: 1px solid var(--color-primary-border, rgba(37, 99, 235, 0.25));
      padding: 2px 8px;
      border-radius: 12px;
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
export class AiSettingsComponent implements OnInit {
  readonly service = inject(SettingsService);
  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    defaultAIProvider: ['gemini'],
    defaultAIModel: ['gemini-2.5-pro'],
    responseDetailLevel: ['balanced'],
    preferredExplanationStyle: ['architectural'],
    streamingResponses: [true],
    autoAnalyze: [true],
    temperature: [0.2],
    maxTokens: [4096],
  });

  constructor() {
    effect(() => {
      const s = this.service.settings();
      if (s && s.ai) {
        this.form.patchValue(s.ai, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    const s = this.service.settings();
    if (s && s.ai) {
      this.form.patchValue(s.ai);
    }
  }

  onSubmit(): void {
    this.service.updateSettings({
      ai: this.form.value,
    }).subscribe();
  }

  onReset(): void {
    const s = this.service.settings();
    if (s && s.ai) {
      this.form.reset(s.ai);
    }
  }
}
