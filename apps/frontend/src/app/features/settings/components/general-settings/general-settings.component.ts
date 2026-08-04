import { Component, inject, OnInit, effect, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { SettingsSectionComponent } from '../settings-section/settings-section.component';
import { PreferenceCardComponent } from '../preference-card/preference-card.component';
import { TIME_ZONE_OPTIONS, LANGUAGE_OPTIONS } from '../../models/user-profile.interface';

/**
 * GeneralSettingsComponent
 * Purpose: Enterprise self-service user identity and regional preferences manager.
 * Responsibilities: Form validation, profile picture upload/crop preview, and updateProfile dispatch.
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
      description="Manage your account identity, public profile details, display language, and regional preferences."
      icon="tune"
      [isSaveable]="true"
      [saving]="service.saving()"
      (save)="onSubmit()"
      (reset)="onReset()"
    >
      <form [formGroup]="form" class="settings-form">

        <!-- Avatar Picture Card -->
        <app-preference-card
          label="Profile Picture"
          description="Your avatar appears across reviews, workspace activities, and audit logs."
          icon="tune"
        >
          <div class="avatar-uploader-row">
            <div class="avatar-preview-box">
              <img
                *ngIf="avatarUrlPreview(); else avatarFallback"
                [src]="avatarUrlPreview()"
                alt="Profile Avatar"
                class="avatar-img"
              />
              <ng-template #avatarFallback>
                <div class="avatar-initials">
                  {{ getInitials() }}
                </div>
              </ng-template>
            </div>

            <div class="avatar-actions">
              <label class="btn-avatar-upload">
                <input type="file" (change)="onFileSelected($event)" accept="image/*" class="file-input-hidden" />
                Upload New Picture
              </label>
              <button
                type="button"
                class="btn-avatar-remove"
                *ngIf="avatarUrlPreview()"
                (click)="removeAvatar()"
              >
                Remove
              </button>
              <span class="avatar-hint">JPG, PNG or GIF. Max 5MB.</span>
            </div>
          </div>
        </app-preference-card>

        <!-- Display Name -->
        <app-preference-card
          label="Display Name"
          description="Your public name visible on code reviews, reports, and team comments."
          icon="tune"
        >
          <div class="input-field-group">
            <input
              type="text"
              class="form-control"
              formControlName="name"
              placeholder="e.g. Mohammad Ali"
              [class.is-invalid]="isFieldInvalid('name')"
            />
            <span class="error-msg" *ngIf="isFieldInvalid('name')">Name is required (min 2 characters).</span>
          </div>
        </app-preference-card>

        <!-- Username -->
        <app-preference-card
          label="Username"
          description="Unique handle used for mention tagging and public profile links."
          icon="tune"
        >
          <div class="input-field-group">
            <div class="input-prefix-wrapper">
              <span class="prefix">&#64;</span>
              <input
                type="text"
                class="form-control prefixed"
                formControlName="username"
                placeholder="mohammad_ali"
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
              placeholder="name@company.com"
              [class.is-invalid]="isFieldInvalid('email')"
            />
            <span class="error-msg" *ngIf="isFieldInvalid('email')">Please enter a valid email address.</span>
          </div>
        </app-preference-card>

        <!-- Bio -->
        <app-preference-card
          label="Bio & Headline"
          description="Short summary about your role, background, or expertise."
          icon="tune"
        >
          <div class="input-field-group full-width">
            <textarea
              class="form-control textarea"
              formControlName="bio"
              rows="3"
              placeholder="Staff Software Engineer & Security Architect specializing in distributed AI applications."
              maxLength="500"
            ></textarea>
            <span class="char-counter">{{ (form.get('bio')?.value || '').length }}/500</span>
          </div>
        </app-preference-card>

        <!-- Company & Location Row -->
        <app-preference-card
          label="Company & Location"
          description="Organization details for team workspace context."
          icon="tune"
        >
          <div class="two-col-group">
            <input
              type="text"
              class="form-control"
              formControlName="company"
              placeholder="Company / Org Name"
            />
            <input
              type="text"
              class="form-control"
              formControlName="location"
              placeholder="San Francisco, CA"
            />
          </div>
        </app-preference-card>

        <!-- Personal Website -->
        <app-preference-card
          label="Personal Website / Portfolio"
          description="External link to your personal blog, GitHub, or portfolio website."
          icon="tune"
        >
          <div class="input-field-group">
            <input
              type="url"
              class="form-control"
              formControlName="website"
              placeholder="https://github.com/mohammadali-eth"
            />
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
            <option value="YYYY-MM-DD">YYYY-MM-DD (2026-08-04)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (08/04/2026)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (04/08/2026)</option>
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
      gap: 12px;
    }

    .avatar-uploader-row {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .avatar-preview-box {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      overflow: hidden;
      background: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--border-color, #e5e7eb);
      flex-shrink: 0;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-initials {
      color: #ffffff;
      font-weight: 700;
      font-size: 1.25rem;
      text-transform: uppercase;
    }

    .avatar-actions {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .btn-avatar-upload {
      display: inline-flex;
      align-items: center;
      padding: 0.4rem 0.85rem;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      color: #2563eb;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      width: fit-content;
    }

    .file-input-hidden { display: none; }

    .btn-avatar-remove {
      background: transparent;
      border: none;
      color: #ef4444;
      font-size: 0.75rem;
      cursor: pointer;
      text-align: left;
      padding: 0;
    }

    .avatar-hint {
      font-size: 0.7rem;
      color: var(--text-subtle, #9ca3af);
    }

    .input-field-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 320px;
    }

    .input-field-group.full-width { width: 100%; max-width: 480px; }

    .two-col-group {
      display: flex;
      gap: 0.75rem;
      width: 100%;
      max-width: 480px;
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
      box-sizing: border-box;
    }

    .form-control.textarea { resize: vertical; min-height: 72px; }

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
      width: 320px;
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

    .radio-pill input { display: none; }

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

    .char-counter {
      font-size: 0.7rem;
      color: var(--text-subtle, #9ca3af);
      align-self: flex-end;
    }
  `],
})
export class GeneralSettingsComponent implements OnInit {
  readonly service = inject(SettingsService);
  private readonly fb = inject(FormBuilder);

  readonly timeZoneOptions = TIME_ZONE_OPTIONS;
  readonly languageOptions = LANGUAGE_OPTIONS;

  public avatarUrlPreview = signal<string | null>(null);

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    avatarUrl: [''],
    bio: [''],
    company: [''],
    location: [''],
    website: [''],
    timeZone: ['UTC', [Validators.required]],
    language: ['en', [Validators.required]],
    dateFormat: ['YYYY-MM-DD', [Validators.required]],
    timeFormat: ['24h', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const p = this.service.profile();
      if (p) {
        this.populateForm(p);
      }
    });
  }

  ngOnInit(): void {
    const p = this.service.profile();
    if (p) {
      this.populateForm(p);
    }
  }

  private populateForm(p: any): void {
    this.avatarUrlPreview.set(p.avatarUrl || null);
    this.form.patchValue({
      name: p.name || '',
      username: p.username || (p.email ? p.email.split('@')[0] : ''),
      email: p.email || '',
      avatarUrl: p.avatarUrl || '',
      bio: p.bio || '',
      company: p.company || '',
      location: p.location || '',
      website: p.website || '',
      timeZone: p.timeZone || 'UTC',
      language: p.language || 'en',
      dateFormat: p.dateFormat || 'YYYY-MM-DD',
      timeFormat: p.timeFormat || '24h',
    }, { emitEvent: false });
  }

  public getInitials(): string {
    const name = this.form.get('name')?.value || 'U';
    return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2);
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.avatarUrlPreview.set(result);
        this.form.patchValue({ avatarUrl: result });
      };
      reader.readAsDataURL(file);
    }
  }

  public removeAvatar(): void {
    this.avatarUrlPreview.set(null);
    this.form.patchValue({ avatarUrl: '' });
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
      this.populateForm(p);
    }
  }
}
