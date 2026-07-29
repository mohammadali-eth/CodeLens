import { Component, inject, OnInit, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { SettingsSectionComponent } from '../settings-section/settings-section.component';
import { PreferenceCardComponent } from '../preference-card/preference-card.component';
import { TIME_ZONE_OPTIONS, LANGUAGE_OPTIONS } from '../../models/user-profile.interface';

/**
 * GeneralSettingsComponent
 * Purpose: Allows users to configure display identity, email, username, timezone, and date/time formatting.
 * Responsibilities: Form validation, initial profile population, and updateProfile dispatch.
 * Dependencies: SettingsService, ReactiveFormsModule, SettingsSectionComponent, PreferenceCardComponent.
 */
@Component({
  selector: 'app-general-settings',
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
      title="General Profile & Localization"
      description="Manage your account identity, display name, time zone, language, and regional preferences."
      icon="tune"
      [isSaveable]="true"
      [saving]="service.saving()"
      (save)="onSubmit()"
      (reset)="onReset()"
    >
      <form [formGroup]="form" class="settings-form">
        <!-- Display Name -->
        <app-preference-card
          label="Display Name"
          description="Your public name visible on code reviews, reports, and comments."
          icon="tune"
        >
          <div class="input-field-group">
            <input
              type="text"
              class="form-control"
              formControlName="name"
              placeholder="e.g. Alex Rivera"
              [class.is-invalid]="isFieldInvalid('name')"
            />
            <span class="error-msg" *ngIf="isFieldInvalid('name')">Name is required (min 2 characters).</span>
          </div>
        </app-preference-card>

        <!-- Username -->
        <app-preference-card
          label="Username"
          description="Unique handle used for mention tagging and profile URLs."
          icon="tune"
        >
          <div class="input-field-group">
            <div class="input-prefix-wrapper">
              <span class="prefix">&#64;</span>
              <input
                type="text"
                class="form-control prefixed"
                formControlName="username"
                placeholder="alex_rivera"
                [class.is-invalid]="isFieldInvalid('username')"
              />
            </div>
            <span class="error-msg" *ngIf="isFieldInvalid('username')">Valid alphanumeric username required.</span>
          </div>
        </app-preference-card>

        <!-- Email Address -->
        <app-preference-card
          label="Email Address"
          description="Primary email used for sign-in, security alerts, and review notifications."
          icon="tune"
        >
          <div class="input-field-group">
            <input
              type="email"
              class="form-control"
              formControlName="email"
              placeholder="alex@company.com"
              [class.is-invalid]="isFieldInvalid('email')"
            />
            <span class="error-msg" *ngIf="isFieldInvalid('email')">Please enter a valid email address.</span>
          </div>
        </app-preference-card>

        <!-- Time Zone -->
        <app-preference-card
          label="Time Zone"
          description="Used for timestamp formatting in activity feeds, audit logs, and scheduled reports."
          icon="tune"
        >
          <select class="form-select" formControlName="timeZone">
            <option *ngFor="let option of timeZoneOptions" [value]="option.value">
              {{ option.label }}
            </option>
          </select>
        </app-preference-card>

        <!-- Language -->
        <app-preference-card
          label="Display Language"
          description="Preferred interface localization language for dashboard and system menus."
          icon="tune"
        >
          <select class="form-select" formControlName="language">
            <option *ngFor="let option of languageOptions" [value]="option.value">
              {{ option.label }}
            </option>
          </select>
        </app-preference-card>

        <!-- Date Format -->
        <app-preference-card
          label="Date Format"
          description="Structure for displaying dates throughout code analysis screens."
          icon="tune"
        >
          <select class="form-select" formControlName="dateFormat">
            <option value="YYYY-MM-DD">YYYY-MM-DD (2026-07-29)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (07/29/2026)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (29/07/2026)</option>
          </select>
        </app-preference-card>

        <!-- Time Format -->
        <app-preference-card
          label="Time Format"
          description="Select between 12-hour AM/PM or 24-hour clock displays."
          icon="tune"
        >
          <div class="radio-pill-group">
            <label class="radio-pill" [class.selected]="form.get('timeFormat')?.value === '12h'">
              <input type="radio" formControlName="timeFormat" value="12h" />
              <span>12-Hour (09:45 AM)</span>
            </label>

            <label class="radio-pill" [class.selected]="form.get('timeFormat')?.value === '24h'">
              <input type="radio" formControlName="timeFormat" value="24h" />
              <span>24-Hour (21:45)</span>
            </label>
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

    .input-field-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 280px;
    }

    .form-control {
      width: 100%;
      background: var(--bg-surface, #ffffff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      padding: 8px 12px;
      color: var(--text-primary, #111827);
      font-size: 0.875rem;
      outline: none;
      box-shadow: var(--shadow-xs);
      transition: all 0.15s ease;
    }

    .form-control:hover {
      border-color: var(--border-medium, #d1d5db);
    }

    .form-control:focus {
      border-color: var(--color-primary, #2563eb);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    .form-control.is-invalid {
      border-color: var(--danger-text, #ef4444);
    }

    .input-prefix-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .prefix {
      position: absolute;
      left: 12px;
      color: var(--text-subtle, #9ca3af);
      font-weight: 500;
      font-size: 0.875rem;
    }

    .form-control.prefixed {
      padding-left: 28px;
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

    .error-msg {
      font-size: 0.75rem;
      color: var(--danger-text, #ef4444);
    }
  `],
})
export class GeneralSettingsComponent implements OnInit {
  readonly service = inject(SettingsService);
  private readonly fb = inject(FormBuilder);

  readonly timeZoneOptions = TIME_ZONE_OPTIONS;
  readonly languageOptions = LANGUAGE_OPTIONS;

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    timeZone: ['UTC', [Validators.required]],
    language: ['en', [Validators.required]],
    dateFormat: ['YYYY-MM-DD', [Validators.required]],
    timeFormat: ['24h', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const p = this.service.profile();
      if (p) {
        this.form.patchValue({
          name: p.name,
          username: p.username,
          email: p.email,
          timeZone: p.timeZone || 'UTC',
          language: p.language || 'en',
          dateFormat: p.dateFormat || 'YYYY-MM-DD',
          timeFormat: p.timeFormat || '24h',
        }, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    const p = this.service.profile();
    if (p) {
      this.form.patchValue({
        name: p.name,
        username: p.username,
        email: p.email,
        timeZone: p.timeZone || 'UTC',
        language: p.language || 'en',
        dateFormat: p.dateFormat || 'YYYY-MM-DD',
        timeFormat: p.timeFormat || '24h',
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.service.updateProfile(this.form.value).subscribe();
  }

  onReset(): void {
    const p = this.service.profile();
    if (p) {
      this.form.reset({
        name: p.name,
        username: p.username,
        email: p.email,
        timeZone: p.timeZone || 'UTC',
        language: p.language || 'en',
        dateFormat: p.dateFormat || 'YYYY-MM-DD',
        timeFormat: p.timeFormat || '24h',
      });
    }
  }
}
