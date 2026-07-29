import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../services/settings.service';
import { SettingsSidebarComponent } from '../components/settings-sidebar/settings-sidebar.component';
import { GeneralSettingsComponent } from '../components/general-settings/general-settings.component';
import { AppearanceSettingsComponent } from '../components/appearance-settings/appearance-settings.component';
import { EditorSettingsComponent } from '../components/editor-settings/editor-settings.component';
import { AiSettingsComponent } from '../components/ai-settings/ai-settings.component';
import { NotificationSettingsComponent } from '../components/notification-settings/notification-settings.component';
import { SecuritySettingsComponent } from '../components/security-settings/security-settings.component';
import { PrivacySettingsComponent } from '../components/privacy-settings/privacy-settings.component';
import { ApiKeySettingsComponent } from '../components/api-key-settings/api-key-settings.component';
import { AboutSettingsComponent } from '../components/about-settings/about-settings.component';

/**
 * SettingsLayoutComponent
 * Purpose: Smart Container shell component for Phase F9 Settings & User Preferences.
 * Responsibilities: Layout shell, sidebar binding, section view routing, success/error alert toasts, and loading skeletons.
 * Dependencies: SettingsService, SettingsSidebarComponent, GeneralSettingsComponent, AppearanceSettingsComponent, EditorSettingsComponent, AiSettingsComponent, NotificationSettingsComponent, SecuritySettingsComponent, PrivacySettingsComponent, ApiKeySettingsComponent, AboutSettingsComponent.
 */
@Component({
  selector: 'app-settings-layout',
  standalone: true,
  imports: [
    CommonModule,
    SettingsSidebarComponent,
    GeneralSettingsComponent,
    AppearanceSettingsComponent,
    EditorSettingsComponent,
    AiSettingsComponent,
    NotificationSettingsComponent,
    SecuritySettingsComponent,
    PrivacySettingsComponent,
    ApiKeySettingsComponent,
    AboutSettingsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="settings-page-wrapper">
      <!-- Header Banner -->
      <header class="settings-header">
        <div class="header-container">
          <div class="breadcrumb">
            <span class="crumb-link">Dashboard</span>
            <svg class="crumb-sep" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <span class="crumb-active">Settings</span>
          </div>

          <div class="header-title-row">
            <div>
              <h1 class="page-title">Settings & Preferences</h1>
              <p class="page-subtitle">
                Manage your account identity, code editor behavior, AI response parameters, security credentials, and API tokens.
              </p>
            </div>
            <div class="header-actions">
              <button
                type="button"
                class="refresh-btn"
                (click)="onRefresh()"
                [disabled]="service.loading()"
              >
                <svg [class.spinning]="service.loading()" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M23 4v6h-6M1 20v-6h6"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                <span>Reload</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Alert Notification Banner -->
      <div class="alert-container" *ngIf="service.successMessage() || service.error()">
        <div class="alert-banner success" *ngIf="service.successMessage()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>{{ service.successMessage() }}</span>
        </div>

        <div class="alert-banner error" *ngIf="service.error()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ service.error() }}</span>
        </div>
      </div>

      <!-- Main Layout Body -->
      <main class="settings-body-container">
        <div class="settings-grid">
          <!-- Left Navigation Sidebar -->
          <aside class="sidebar-column">
            <app-settings-sidebar
              [activeId]="service.activeSection()"
              (sectionChange)="onSectionChange($event)"
            ></app-settings-sidebar>
          </aside>

          <!-- Right Settings Content Pane -->
          <section class="content-column">
            <!-- Skeleton Loader -->
            <div class="skeleton-wrapper" *ngIf="service.loading()">
              <div class="skeleton-card header-skel"></div>
              <div class="skeleton-card body-skel"></div>
              <div class="skeleton-card body-skel"></div>
            </div>

            <!-- Dynamic Section Renderer Slot -->
            <div class="section-content" *ngIf="!service.loading()">
              <div [ngSwitch]="service.activeSection()">
                <!-- General Settings -->
                <app-general-settings *ngSwitchCase="'general'"></app-general-settings>

                <!-- Appearance Settings -->
                <app-appearance-settings *ngSwitchCase="'appearance'"></app-appearance-settings>

                <!-- Editor Preferences Settings -->
                <app-editor-settings *ngSwitchCase="'editor'"></app-editor-settings>

                <!-- AI Preferences Settings -->
                <app-ai-settings *ngSwitchCase="'ai'"></app-ai-settings>

                <!-- Notification Settings -->
                <app-notification-settings *ngSwitchCase="'notifications'"></app-notification-settings>

                <!-- Security & Sessions Settings -->
                <app-security-settings *ngSwitchCase="'security'"></app-security-settings>

                <!-- Privacy & Data Settings -->
                <app-privacy-settings *ngSwitchCase="'privacy'"></app-privacy-settings>

                <!-- API Keys Management -->
                <app-api-key-settings *ngSwitchCase="'apikeys'"></app-api-key-settings>

                <!-- About CodeLens -->
                <app-about-settings *ngSwitchCase="'about'"></app-about-settings>

                <div *ngSwitchDefault class="placeholder-section">
                  <div class="placeholder-card">
                    <svg class="placeholder-icon" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    <h3>Section Loaded</h3>
                    <p>Current active section: <strong>{{ service.activeSection() | uppercase }}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .settings-page-wrapper {
      min-height: 100vh;
      background: var(--bg-app, #f8fafc);
      color: var(--text-primary, #111827);
      padding-bottom: 60px;
    }

    .settings-header {
      background: var(--bg-surface, #ffffff);
      border-bottom: 1px solid var(--border-color, #e5e7eb);
      padding: 24px 32px;
      box-shadow: var(--shadow-xs, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
    }

    .header-container {
      max-width: 1320px;
      margin: 0 auto;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8125rem;
      color: var(--text-muted, #6b7280);
      margin-bottom: 8px;
    }

    .crumb-link {
      color: var(--color-primary, #2563eb);
      font-weight: 500;
      cursor: pointer;
    }

    .crumb-sep {
      color: var(--text-subtle, #9ca3af);
    }

    .crumb-active {
      color: var(--text-primary, #111827);
      font-weight: 600;
    }

    .header-title-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 24px;
    }

    .page-title {
      margin: 0;
      font-size: 1.625rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text-primary, #111827);
    }

    .page-subtitle {
      margin: 4px 0 0 0;
      font-size: 0.875rem;
      color: var(--text-muted, #6b7280);
      max-width: 760px;
      line-height: 1.5;
    }

    .refresh-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-surface, #ffffff);
      border: 1px solid var(--border-color, #e5e7eb);
      color: var(--text-secondary, #374151);
      padding: 8px 14px;
      border-radius: var(--radius-md, 8px);
      font-size: 0.84375rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: var(--shadow-xs);
      transition: all 0.15s ease;
    }

    .refresh-btn:hover {
      background: var(--bg-surface-secondary, #f1f5f9);
      color: var(--text-primary, #111827);
      border-color: var(--border-medium, #d1d5db);
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    .alert-container {
      max-width: 1320px;
      margin: 16px auto 0 auto;
      padding: 0 32px;
    }

    .alert-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 18px;
      border-radius: var(--radius-md, 8px);
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 12px;
      box-shadow: var(--shadow-xs);
    }

    .alert-banner.success {
      background: var(--success-bg, #ecfdf5);
      border: 1px solid var(--success-border, #a7f3d0);
      color: var(--success-text, #047857);
    }

    .alert-banner.error {
      background: var(--danger-bg, #fef2f2);
      border: 1px solid var(--danger-border, #fca5a5);
      color: var(--danger-text, #b91c1c);
    }

    .settings-body-container {
      max-width: 1320px;
      margin: 28px auto 0 auto;
      padding: 0 32px;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 32px;
    }

    @media (max-width: 992px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }
    }

    .placeholder-card {
      background: var(--bg-surface, #ffffff);
      border: 1px dashed var(--border-color, #e5e7eb);
      border-radius: var(--radius-lg, 12px);
      padding: 48px 24px;
      text-align: center;
      color: var(--text-muted, #6b7280);
      box-shadow: var(--shadow-sm);
    }

    .placeholder-icon {
      color: var(--color-primary, #2563eb);
      margin-bottom: 12px;
    }

    .skeleton-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .skeleton-card {
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%;
      border-radius: var(--radius-lg, 12px);
      animation: skeleton-shimmer 1.5s infinite;
    }

    .header-skel { height: 80px; }
    .body-skel { height: 160px; }

    @keyframes skeleton-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class SettingsLayoutComponent {
  readonly service = inject(SettingsService);

  onSectionChange(sectionId: string): void {
    this.service.activeSection.set(sectionId);
  }

  onRefresh(): void {
    this.service.loadAllInitialData();
  }
}
