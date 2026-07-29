import { Component, inject, OnInit, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { SettingsSectionComponent } from '../settings-section/settings-section.component';
import { PreferenceCardComponent } from '../preference-card/preference-card.component';
import { NotificationPreferences } from '../../models/user-settings.interface';

/**
 * NotificationSettingsComponent
 * Purpose: Manages user preferences for email alerts, in-app bell notifications, and automated security event triggers.
 * Responsibilities: Form management, channel grouping, and backend persistence.
 * Dependencies: SettingsService, ReactiveFormsModule, SettingsSectionComponent, PreferenceCardComponent.
 */
@Component({
  selector: 'app-notification-settings',
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
      title="Notification Channels & Alerts"
      description="Configure how and when CodeLens delivers code review updates, security alerts, and system reports."
      icon="notifications"
      [isSaveable]="true"
      [saving]="service.saving()"
      (save)="onSubmit()"
      (reset)="onReset()"
    >
      <form [formGroup]="form" class="settings-form">
        <div class="channel-group-header">PRIMARY DELIVERY CHANNELS</div>

        <!-- Email Notifications -->
        <app-preference-card
          label="Email Notifications"
          description="Send review digests and urgent alerts directly to your registered email address."
          icon="bell"
        >
          <label class="switch-toggle">
            <input type="checkbox" formControlName="emailNotifications" />
            <span class="slider"></span>
          </label>
        </app-preference-card>

        <!-- In-App Notifications -->
        <app-preference-card
          label="In-App Header Bell Notifications"
          description="Display real-time popup badges in the top navigation bar when activity occurs."
          icon="bell"
        >
          <label class="switch-toggle">
            <input type="checkbox" formControlName="inAppNotifications" />
            <span class="slider"></span>
          </label>
        </app-preference-card>

        <div class="channel-group-header">EVENT SUBSCRIPTIONS & TRIGGERS</div>

        <!-- Review Completed -->
        <app-preference-card
          label="Code Review Completion Alerts"
          description="Notify when an automated AI code review or team peer review completes."
          icon="bell"
        >
          <label class="switch-toggle">
            <input type="checkbox" formControlName="reviewCompleted" />
            <span class="slider"></span>
          </label>
        </app-preference-card>

        <!-- Security Alerts -->
        <app-preference-card
          label="Security Defect Warnings"
          description="High-priority notifications for critical SAST vulnerabilities or credential leaks."
          icon="shield"
        >
          <label class="switch-toggle">
            <input type="checkbox" formControlName="securityAlerts" />
            <span class="slider"></span>
          </label>
        </app-preference-card>

        <!-- Report Generated -->
        <app-preference-card
          label="Scheduled Analytics Reports"
          description="Receive notifications when weekly quality, debt, or coverage PDF reports finish rendering."
          icon="bell"
        >
          <label class="switch-toggle">
            <input type="checkbox" formControlName="reportGenerated" />
            <span class="slider"></span>
          </label>
        </app-preference-card>

        <!-- AI Chat Updates -->
        <app-preference-card
          label="AI Chat Assistant Responses"
          description="Alert when background long-running AI code refactoring chats generate responses."
          icon="psychology"
        >
          <label class="switch-toggle">
            <input type="checkbox" formControlName="aiChatUpdates" />
            <span class="slider"></span>
          </label>
        </app-preference-card>

        <!-- Marketing Emails -->
        <app-preference-card
          label="Product Updates & Changelogs"
          description="Receive monthly product release summaries, feature previews, and developer tips."
          icon="bell"
        >
          <label class="switch-toggle">
            <input type="checkbox" formControlName="marketingEmails" />
            <span class="slider"></span>
          </label>
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

    .channel-group-header {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-subtle, #9ca3af);
      margin: 16px 0 8px 0;
    }

    .channel-group-header:first-child {
      margin-top: 0;
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
export class NotificationSettingsComponent implements OnInit {
  readonly service = inject(SettingsService);
  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    emailNotifications: [true],
    inAppNotifications: [true],
    reviewCompleted: [true],
    reportGenerated: [true],
    aiChatUpdates: [false],
    securityAlerts: [true],
    marketingEmails: [false],
  });

  constructor() {
    effect(() => {
      const s = this.service.settings();
      if (s && s.notifications) {
        this.form.patchValue(s.notifications, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    const s = this.service.settings();
    if (s && s.notifications) {
      this.form.patchValue(s.notifications);
    }
  }

  onSubmit(): void {
    this.service.updateSettings({
      notifications: this.form.value,
    }).subscribe();
  }

  onReset(): void {
    const s = this.service.settings();
    if (s && s.notifications) {
      this.form.reset(s.notifications);
    }
  }
}
