import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { SettingsSectionComponent } from '../settings-section/settings-section.component';
import { PreferenceCardComponent } from '../preference-card/preference-card.component';

/**
 * ApiKeySettingsComponent
 * Purpose: Manages personal access tokens and CI/CD bot keys for programmatically accessing CodeLens REST APIs.
 * Responsibilities: Key generation form, secret token modal alert, key list rendering, and key revocation.
 * Dependencies: SettingsService, ReactiveFormsModule, SettingsSectionComponent, PreferenceCardComponent.
 */
@Component({
  selector: 'app-api-key-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SettingsSectionComponent,
    PreferenceCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Secret Token Alert Banner (Shown after creation) -->
    <div class="secret-alert-card" *ngIf="service.createdKeySecret()">
      <div class="secret-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>Save Your Secret Token</span>
      </div>
      <p class="secret-desc">
        Make sure to copy your API key now. You will not be able to see it again!
      </p>
      <div class="secret-token-box">
        <code class="secret-code">{{ service.createdKeySecret() }}</code>
        <button type="button" class="btn-copy" (click)="onCopySecret(service.createdKeySecret()!)">
          Copy
        </button>
      </div>
    </div>

    <!-- Create New API Key Section -->
    <app-settings-section
      title="API Access Keys & Automation Tokens"
      description="Generate personal access tokens to integrate CodeLens AI code reviews into GitHub Actions, GitLab CI, or custom webhooks."
      icon="key"
      [isSaveable]="true"
      [saving]="service.saving()"
      (save)="onCreateKey()"
      (reset)="onResetForm()"
    >
      <form [formGroup]="keyForm" class="settings-form">
        <!-- Key Name -->
        <app-preference-card
          label="Token Identifier Name"
          description="Descriptive name to distinguish token usage (e.g. GitHub Actions Bot, CLI Local)."
          icon="key"
        >
          <div class="input-field-group">
            <input
              type="text"
              class="form-control"
              formControlName="name"
              placeholder="e.g. CI/CD Release Bot"
              [class.is-invalid]="isFieldInvalid('name')"
            />
            <span class="error-msg" *ngIf="isFieldInvalid('name')">Token name is required.</span>
          </div>
        </app-preference-card>

        <!-- Permissions Scope -->
        <app-preference-card
          label="Token Permission Scope"
          description="Access control level granted to API requests authenticated with this token."
          icon="key"
        >
          <select class="form-select" formControlName="permissions">
            <option value="full_access">Full Access (Read/Write/Admin)</option>
            <option value="ci_cd_bot">CI/CD Bot Scope (Trigger & Comment Reviews)</option>
            <option value="read_only">Read-Only (Fetch Reports & Metrics)</option>
          </select>
        </app-preference-card>

        <!-- Expiration Days -->
        <app-preference-card
          label="Expiration Term"
          description="Token validity period before requiring key rotation."
          icon="key"
        >
          <select class="form-select" formControlName="expirationDays">
            <option [value]="30">30 Days</option>
            <option [value]="90">90 Days (Recommended)</option>
            <option [value]="365">1 Year</option>
            <option [value]="null">Never (No Expiration)</option>
          </select>
        </app-preference-card>
      </form>
    </app-settings-section>

    <!-- Active API Keys Table Section -->
    <app-settings-section
      title="Active API Access Tokens"
      description="Manage existing tokens, view last used dates, or revoke compromise risks."
      icon="key"
    >
      <div class="keys-table-card">
        <table class="keys-table" *ngIf="service.apiKeys().length > 0; else noKeys">
          <thead>
            <tr>
              <th>TOKEN NAME</th>
              <th>KEY HINT</th>
              <th>SCOPE</th>
              <th>CREATED</th>
              <th>EXPIRES</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let k of service.apiKeys()">
              <td class="name-cell">
                <span class="key-name">{{ k.name }}</span>
              </td>
              <td>
                <code class="prefix-code">{{ k.keyHint }}</code>
              </td>
              <td>
                <span class="scope-chip">
                  {{ k.permissions.join(', ') }}
                </span>
              </td>
              <td class="date-cell">{{ k.createdAt | date:'shortDate' }}</td>
              <td class="date-cell">{{ k.expiresAt ? (k.expiresAt | date:'shortDate') : 'Never' }}</td>
              <td>
                <button type="button" class="btn-revoke" (click)="onRevokeKey(k.id)">
                  Revoke
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <ng-template #noKeys>
          <div class="empty-state">
            <p>No active API keys found. Use the form above to generate your first token.</p>
          </div>
        </ng-template>
      </div>
    </app-settings-section>
  `,
  styles: [`
    .secret-alert-card {
      background: var(--warning-bg, #fffbeb);
      border: 1px solid var(--warning-border, #fcd34d);
      border-radius: var(--radius-lg, 12px);
      padding: 16px 20px;
      margin-bottom: 24px;
      color: #b45309;
      box-shadow: var(--shadow-sm);
    }

    .secret-header {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      font-size: 1rem;
    }

    .secret-desc {
      margin: 6px 0 12px 0;
      font-size: 0.84375rem;
      color: #92400e;
    }

    .secret-token-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #0f172a;
      border: 1px solid #f59e0b;
      border-radius: var(--radius-md, 8px);
      padding: 10px 14px;
    }

    .secret-code {
      font-family: 'Fira Code', monospace;
      font-size: 0.875rem;
      color: #34d399;
      word-break: break-all;
    }

    .btn-copy {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #ffffff;
      padding: 4px 12px;
      border-radius: var(--radius-md, 8px);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .btn-copy:hover {
      background: rgba(255, 255, 255, 0.25);
    }

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

    .keys-table-card {
      overflow-x: auto;
    }

    .keys-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.84375rem;
      text-align: left;
    }

    .keys-table th {
      padding: 10px 14px;
      font-size: 0.6875rem;
      font-weight: 700;
      color: var(--text-muted, #6b7280);
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-color, #e5e7eb);
    }

    .keys-table td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border-color, #e5e7eb);
      color: var(--text-secondary, #374151);
    }

    .name-cell .key-name {
      font-weight: 600;
      color: var(--text-primary, #111827);
    }

    .prefix-code {
      font-family: 'Fira Code', monospace;
      font-size: 0.8125rem;
      color: var(--color-primary, #2563eb);
    }

    .scope-chip {
      font-size: 0.71875rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
      background: var(--color-primary-light, #eff6ff);
      color: var(--color-primary, #2563eb);
      border: 1px solid var(--color-primary-border, rgba(37, 99, 235, 0.25));
    }

    .date-cell {
      color: var(--text-muted, #6b7280);
      font-size: 0.8125rem;
    }

    .btn-revoke {
      background: var(--danger-bg, #fef2f2);
      border: 1px solid var(--danger-border, #fca5a5);
      color: var(--danger-text, #b91c1c);
      padding: 4px 10px;
      border-radius: var(--radius-md, 8px);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-revoke:hover {
      background: #fee2e2;
    }

    .empty-state {
      padding: 24px;
      text-align: center;
      color: var(--text-muted, #6b7280);
    }
  `],
})
export class ApiKeySettingsComponent {
  readonly service = inject(SettingsService);
  private readonly fb = inject(FormBuilder);

  readonly keyForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    permissions: ['ci_cd_bot', [Validators.required]],
    expirationDays: [90],
  });

  isFieldInvalid(field: string): boolean {
    const fc = this.keyForm.get(field);
    return !!(fc && fc.invalid && (fc.dirty || fc.touched));
  }

  onCreateKey(): void {
    if (this.keyForm.invalid) {
      this.keyForm.markAllAsTouched();
      return;
    }

    const val = this.keyForm.value;
    this.service.createApiKey({
      name: val.name,
      permissions: [val.permissions],
      expirationDays: val.expirationDays ? Number(val.expirationDays) : null,
    }).subscribe(() => {
      this.keyForm.reset({
        permissions: 'ci_cd_bot',
        expirationDays: 90,
      });
    });
  }

  onResetForm(): void {
    this.keyForm.reset({
      permissions: 'ci_cd_bot',
      expirationDays: 90,
    });
  }

  onRevokeKey(keyId: string): void {
    if (confirm('Are you sure you want to revoke this API key? Services using this token will be denied access.')) {
      this.service.revokeApiKey(keyId).subscribe();
    }
  }

  onCopySecret(secret: string): void {
    navigator.clipboard.writeText(secret);
    alert('API Secret copied to clipboard!');
  }
}
