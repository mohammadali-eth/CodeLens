import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { SettingsSectionComponent } from '../settings-section/settings-section.component';
import { PreferenceCardComponent } from '../preference-card/preference-card.component';
import { UserSession } from '../../models/session.interface';

/**
 * SecuritySettingsComponent
 * Purpose: Allows users to change passwords, monitor 2FA status, and manage active device sessions.
 * Responsibilities: Password validation, session revocation triggers, and 2FA status display.
 * Dependencies: SettingsService, ReactiveFormsModule, SettingsSectionComponent, PreferenceCardComponent.
 */
@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SettingsSectionComponent,
    PreferenceCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Password Change Section -->
    <app-settings-section
      title="Security & Password Authentication"
      description="Update your sign-in credentials, monitor account protection, and manage active browser sessions."
      icon="security"
      [isSaveable]="true"
      [saving]="service.saving()"
      (save)="onChangePassword()"
      (reset)="onResetPasswordForm()"
    >
      <form [formGroup]="passwordForm" class="settings-form">
        <!-- Current Password -->
        <app-preference-card
          label="Current Password"
          description="Enter your existing account password to confirm credential changes."
          icon="lock"
        >
          <div class="input-field-group">
            <input
              type="password"
              class="form-control"
              formControlName="currentPassword"
              placeholder="••••••••••••"
              [class.is-invalid]="isFieldInvalid('currentPassword')"
            />
            <span class="error-msg" *ngIf="isFieldInvalid('currentPassword')">Current password is required.</span>
          </div>
        </app-preference-card>

        <!-- New Password -->
        <app-preference-card
          label="New Password"
          description="Must be at least 8 characters long containing uppercase, lowercase, numbers, and symbols."
          icon="lock"
        >
          <div class="input-field-group">
            <input
              type="password"
              class="form-control"
              formControlName="newPassword"
              placeholder="••••••••••••"
              [class.is-invalid]="isFieldInvalid('newPassword')"
            />
            <span class="error-msg" *ngIf="isFieldInvalid('newPassword')">Password must be at least 8 characters.</span>
          </div>
        </app-preference-card>

        <!-- Confirm Password -->
        <app-preference-card
          label="Confirm New Password"
          description="Re-type your new password to prevent typos."
          icon="lock"
        >
          <div class="input-field-group">
            <input
              type="password"
              class="form-control"
              formControlName="confirmPassword"
              placeholder="••••••••••••"
              [class.is-invalid]="isFieldInvalid('confirmPassword') || passwordMismatch"
            />
            <span class="error-msg" *ngIf="passwordMismatch">Passwords do not match.</span>
          </div>
        </app-preference-card>
      </form>
    </app-settings-section>

    <!-- Two-Factor Authentication Card -->
    <app-settings-section
      title="Two-Factor Authentication (2FA)"
      description="Add an extra layer of security to your account using TOTP authenticator apps."
      icon="shield"
    >
      <app-preference-card
        label="Authenticator App (TOTP)"
        description="Use Google Authenticator, 1Password, or Authy to generate time-based verification codes."
        icon="shield"
      >
        <div class="two-fa-action-row">
          <span class="status-badge" [class.enabled]="service.securityState().enabled">
            {{ service.securityState().enabled ? 'ENABLED' : 'DISABLED' }}
          </span>
          <button type="button" class="btn-action" (click)="toggle2FA()">
            {{ service.securityState().enabled ? 'Disable 2FA' : 'Configure 2FA' }}
          </button>
        </div>
      </app-preference-card>
    </app-settings-section>

    <!-- Active Sessions Section -->
    <app-settings-section
      title="Active Device & Browser Sessions"
      description="Revoke access for unrecognized devices or terminate all active web sessions."
      icon="security"
    >
      <div headerActions>
        <button
          type="button"
          class="btn-revoke-all"
          (click)="onRevokeAllOthers()"
          [disabled]="service.sessions().length <= 1"
        >
          Revoke All Other Sessions
        </button>
      </div>

      <div class="sessions-list">
        <div class="session-item" *ngFor="let s of service.sessions()">
          <div class="session-info">
            <div class="device-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div class="device-details">
              <div class="device-name-row">
                <span class="browser-name">{{ s.browser }} on {{ s.os }}</span>
                <span class="current-chip" *ngIf="s.isCurrent">CURRENT DEVICE</span>
              </div>
              <div class="meta-row">
                <span>IP: {{ s.ipAddress }}</span>
                <span class="dot">•</span>
                <span>Last active: {{ s.lastActiveAt | date:'short' }}</span>
                <span class="dot">•</span>
                <span>Location: {{ s.location || 'Unknown' }}</span>
              </div>
            </div>
          </div>

          <div class="session-action">
            <button
              type="button"
              class="btn-revoke-single"
              *ngIf="!s.isCurrent"
              (click)="onRevokeSession(s.id)"
            >
              Revoke
            </button>
          </div>
        </div>
      </div>
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
      border-color: var(--danger-text, #b91c1c);
    }

    .error-msg {
      font-size: 0.75rem;
      color: var(--danger-text, #b91c1c);
    }

    .two-fa-action-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
      background: var(--danger-bg, #fef2f2);
      color: var(--danger-text, #b91c1c);
      border: 1px solid var(--danger-border, #fca5a5);
    }

    .status-badge.enabled {
      background: var(--success-bg, #ecfdf5);
      color: var(--success-text, #047857);
      border-color: var(--success-border, #a7f3d0);
    }

    .btn-action {
      background: var(--bg-surface, #ffffff);
      border: 1px solid var(--border-color, #e5e7eb);
      color: var(--text-secondary, #374151);
      padding: 6px 14px;
      border-radius: var(--radius-md, 8px);
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: var(--shadow-xs);
      transition: all 0.15s ease;
    }

    .btn-action:hover {
      background: var(--bg-surface-secondary, #f1f5f9);
      color: var(--text-primary, #111827);
    }

    .btn-revoke-all {
      background: var(--danger-bg, #fef2f2);
      border: 1px solid var(--danger-border, #fca5a5);
      color: var(--danger-text, #b91c1c);
      padding: 6px 12px;
      border-radius: var(--radius-md, 8px);
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-revoke-all:hover:not(:disabled) {
      background: #fee2e2;
    }

    .btn-revoke-all:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .sessions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .session-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: var(--bg-app, #f8fafc);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: var(--radius-md, 8px);
    }

    .session-info {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .device-icon {
      color: var(--color-primary, #2563eb);
    }

    .device-name-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .browser-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary, #111827);
    }

    .current-chip {
      font-size: 0.6875rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--success-bg, #ecfdf5);
      color: var(--success-text, #047857);
      border: 1px solid var(--success-border, #a7f3d0);
    }

    .meta-row {
      font-size: 0.78125rem;
      color: var(--text-muted, #6b7280);
      margin-top: 2px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-revoke-single {
      background: var(--bg-surface, #ffffff);
      border: 1px solid var(--danger-border, #fca5a5);
      color: var(--danger-text, #b91c1c);
      padding: 4px 10px;
      border-radius: var(--radius-md, 8px);
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-revoke-single:hover {
      background: var(--danger-bg, #fef2f2);
    }
  `],
})
export class SecuritySettingsComponent {
  readonly service = inject(SettingsService);
  private readonly fb = inject(FormBuilder);

  readonly passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  get passwordMismatch(): boolean {
    const newP = this.passwordForm.get('newPassword')?.value;
    const confP = this.passwordForm.get('confirmPassword')?.value;
    return !!(newP && confP && newP !== confP);
  }

  isFieldInvalid(field: string): boolean {
    const fc = this.passwordForm.get(field);
    return !!(fc && fc.invalid && (fc.dirty || fc.touched));
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid || this.passwordMismatch) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.service.changePassword(this.passwordForm.value).subscribe(() => {
      this.passwordForm.reset();
    });
  }

  onResetPasswordForm(): void {
    this.passwordForm.reset();
  }

  toggle2FA(): void {
    this.service.toggle2FA().subscribe();
  }

  onRevokeSession(sessionId: string): void {
    this.service.revokeSession(sessionId).subscribe();
  }

  onRevokeAllOthers(): void {
    this.service.revokeAllOtherSessions().subscribe();
  }
}
