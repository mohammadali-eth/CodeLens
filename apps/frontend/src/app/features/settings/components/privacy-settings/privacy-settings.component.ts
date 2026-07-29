import { Component, inject, OnInit, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { SettingsSectionComponent } from '../settings-section/settings-section.component';
import { PreferenceCardComponent } from '../preference-card/preference-card.component';
import { PrivacyPreferences } from '../../models/user-settings.interface';

/**
 * PrivacySettingsComponent
 * Purpose: Manages user privacy visibility, report sharing defaults, data export, and account deletion danger zone.
 * Responsibilities: Privacy form state, telemetry options, export triggers, and danger zone actions.
 * Dependencies: SettingsService, ReactiveFormsModule, SettingsSectionComponent, PreferenceCardComponent.
 */
@Component({
  selector: 'app-privacy-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SettingsSectionComponent,
    PreferenceCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Privacy Preferences -->
    <app-settings-section
      title="Privacy & Data Control"
      description="Manage profile visibility across your organization, report sharing options, and data collection choices."
      icon="privacy_tip"
      [isSaveable]="true"
      [saving]="service.saving()"
      (save)="onSubmit()"
      (reset)="onReset()"
    >
      <form [formGroup]="form" class="settings-form">
        <!-- Profile Visibility -->
        <app-preference-card
          label="Profile Visibility"
          description="Controls who inside your enterprise workspace can view your activity metrics and code stats."
          icon="privacy_tip"
        >
          <select class="form-select" formControlName="profileVisibility">
            <option value="organization">Organization Members Only (Default)</option>
            <option value="public">Public (Visible across connected repos)</option>
            <option value="private">Private (Only workspace admins)</option>
          </select>
        </app-preference-card>

        <!-- Share Reports by Default -->
        <app-preference-card
          label="Share Generated Reports"
          description="Automatically mark generated PDF and Markdown reports as shareable with team members."
          icon="privacy_tip"
        >
          <label class="switch-toggle">
            <input type="checkbox" formControlName="shareReportsByDefault" />
            <span class="slider"></span>
          </label>
        </app-preference-card>

        <!-- Analytics Participation -->
        <app-preference-card
          label="Product Improvement Telemetry"
          description="Share anonymous usage statistics to help improve CodeLens AI model performance."
          icon="privacy_tip"
        >
          <label class="switch-toggle">
            <input type="checkbox" formControlName="analyticsParticipation" />
            <span class="slider"></span>
          </label>
        </app-preference-card>
      </form>
    </app-settings-section>

    <!-- Data Portability & Export -->
    <app-settings-section
      title="Data Portability & Archives"
      description="Download a complete machine-readable copy of your personal activity, settings, and review logs."
      icon="privacy_tip"
    >
      <app-preference-card
        label="Export Personal Data Package"
        description="Generates a downloadable ZIP archive containing your JSON activity history, settings, and audits."
        icon="privacy_tip"
      >
        <button type="button" class="btn-export" (click)="onExportData()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Download Export (ZIP)</span>
        </button>
      </app-preference-card>
    </app-settings-section>

    <!-- Danger Zone -->
    <app-settings-section
      title="Danger Zone"
      description="Irreversible account actions and workspace data deletion."
      icon="privacy_tip"
    >
      <div class="danger-card">
        <div class="danger-info">
          <h4 class="danger-title">Delete Account & Data</h4>
          <p class="danger-desc">
            Permanently remove your account, associated settings, API keys, and private AI review logs from CodeLens. This action cannot be undone.
          </p>
        </div>
        <button type="button" class="btn-danger" (click)="onDeleteAccount()">
          Delete Account
        </button>
      </div>
    </app-settings-section>
  `,
  styles: [`
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

    .btn-export {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-surface, #ffffff);
      border: 1px solid var(--border-color, #e5e7eb);
      color: var(--text-secondary, #374151);
      padding: 8px 16px;
      border-radius: var(--radius-md, 8px);
      font-size: 0.84375rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: var(--shadow-xs);
      transition: all 0.15s ease;
    }

    .btn-export:hover {
      background: var(--bg-surface-secondary, #f1f5f9);
      color: var(--text-primary, #111827);
    }

    .danger-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 16px 20px;
      background: var(--danger-bg, #fef2f2);
      border: 1px solid var(--danger-border, #fca5a5);
      border-radius: var(--radius-md, 8px);
    }

    .danger-title {
      margin: 0;
      font-size: 0.9375rem;
      font-weight: 700;
      color: var(--danger-text, #b91c1c);
    }

    .danger-desc {
      margin: 4px 0 0 0;
      font-size: 0.8125rem;
      color: var(--text-secondary, #4b5563);
    }

    .btn-danger {
      background: #dc2626;
      border: 1px solid transparent;
      color: #ffffff;
      padding: 8px 16px;
      border-radius: var(--radius-md, 8px);
      font-size: 0.84375rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: var(--shadow-xs);
      transition: background 0.15s ease;
    }

    .btn-danger:hover {
      background: #b91c1c;
    }
  `],
})
export class PrivacySettingsComponent implements OnInit {
  readonly service = inject(SettingsService);
  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    profileVisibility: ['organization'],
    shareReportsByDefault: [false],
    analyticsParticipation: [true],
  });

  constructor() {
    effect(() => {
      const s = this.service.settings();
      if (s && s.privacy) {
        this.form.patchValue(s.privacy, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    const s = this.service.settings();
    if (s && s.privacy) {
      this.form.patchValue(s.privacy);
    }
  }

  onSubmit(): void {
    this.service.updateSettings({
      privacy: this.form.value,
    }).subscribe();
  }

  onReset(): void {
    const s = this.service.settings();
    if (s && s.privacy) {
      this.form.reset(s.privacy);
    }
  }

  onExportData(): void {
    this.service.exportUserData().subscribe();
  }

  onDeleteAccount(): void {
    if (confirm('Are you sure you want to request account deletion? All data will be permanently purged.')) {
      this.service.deleteAccount().subscribe();
    }
  }
}
