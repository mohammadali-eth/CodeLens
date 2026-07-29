import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SettingsSectionComponent
 * Purpose: Enterprise container wrapper for individual settings categories.
 * Responsibilities: Render section header, icon, description, status badge, and optional save action bar.
 * Dependencies: Angular CommonModule.
 */
@Component({
  selector: 'app-settings-section',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="settings-section-card" [class.has-footer]="isSaveable">
      <header class="section-header">
        <div class="header-main">
          <div class="icon-avatar" *ngIf="icon">
            <svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <ng-container [ngSwitch]="icon">
                <path *ngSwitchCase="'tune'" d="M4 21v-7m0-4V3m8 21v-11m0-4V3m8 21v-9m0-4V3M1 14h6m2-6h6m2 8h6"/>
                <path *ngSwitchCase="'palette'" d="M12 21a9 9 0 1 1 0-18c2 0 3.5 1 3.5 3 0 1.5-1 2.5-1 3.5 0 1.5 1.5 2 3 2h.5A4.5 4.5 0 0 1 21 16c0 2.8-4 5-9 5z"/>
                <path *ngSwitchCase="'code'" d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
                <path *ngSwitchCase="'psychology'" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                <path *ngSwitchCase="'notifications'" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
                <path *ngSwitchCase="'security'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path *ngSwitchCase="'privacy_tip'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 8v4m0 4h.01"/>
                <path *ngSwitchCase="'key'" d="M21 2l-2 2m-1.5 1.5L14 9.5M9.5 14A5.5 5.5 0 1 1 15 8.5L22 15.5V20h-4.5v-2H15.5v-2.5L14 14"/>
                <path *ngSwitchDefault d="M12 2v20m10-10H2"/>
              </ng-container>
            </svg>
          </div>
          <div class="title-group">
            <div class="title-row">
              <h2 class="section-title">{{ title }}</h2>
              <span class="section-badge" *ngIf="badge">{{ badge }}</span>
            </div>
            <p class="section-description" *ngIf="description">{{ description }}</p>
          </div>
        </div>

        <div class="header-actions">
          <ng-content select="[headerActions]"></ng-content>
        </div>
      </header>

      <div class="section-body">
        <ng-content></ng-content>
      </div>

      <footer class="section-footer" *ngIf="isSaveable">
        <div class="footer-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>Unsaved changes will be applied across your workspace.</span>
        </div>
        <div class="footer-buttons">
          <button type="button" class="btn-secondary" (click)="reset.emit()" [disabled]="saving">
            Reset
          </button>
          <button type="button" class="btn-primary" (click)="save.emit()" [disabled]="saving">
            <svg *ngIf="!saving" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span *ngIf="saving" class="spinner"></span>
            <span>{{ saving ? 'Saving...' : 'Save Changes' }}</span>
          </button>
        </div>
      </footer>
    </section>
  `,
  styles: [`
    .settings-section-card {
      background: var(--bg-surface, #ffffff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: var(--radius-lg, 12px);
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm, 0 1px 3px 0 rgba(15, 23, 42, 0.06));
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .settings-section-card:hover {
      border-color: var(--border-medium, #d1d5db);
      box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(15, 23, 42, 0.08));
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-color, #e5e7eb);
      background: var(--bg-surface, #ffffff);
    }

    .header-main {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .icon-avatar {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: var(--color-primary-light, #eff6ff);
      border: 1px solid var(--color-primary-border, rgba(37, 99, 235, 0.25));
      color: var(--color-primary, #2563eb);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary, #111827);
      letter-spacing: -0.01em;
    }

    .section-badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
      background: var(--color-primary-light, #eff6ff);
      color: var(--color-primary, #2563eb);
      border: 1px solid var(--color-primary-border, rgba(37, 99, 235, 0.25));
    }

    .section-description {
      margin: 4px 0 0 0;
      font-size: 0.875rem;
      color: var(--text-muted, #6b7280);
    }

    .section-body {
      padding: 24px;
    }

    .section-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      background: var(--bg-app, #f8fafc);
      border-top: 1px solid var(--border-color, #e5e7eb);
    }

    .footer-note {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8125rem;
      color: var(--text-muted, #6b7280);
    }

    .footer-buttons {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-secondary {
      background: var(--bg-surface, #ffffff);
      border: 1px solid var(--border-color, #e5e7eb);
      color: var(--text-secondary, #374151);
      padding: 8px 16px;
      border-radius: var(--radius-md, 8px);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: var(--shadow-xs);
      transition: all 0.15s ease;
    }

    .btn-secondary:hover {
      background: var(--bg-surface-secondary, #f1f5f9);
      color: var(--text-primary, #111827);
      border-color: var(--border-medium, #d1d5db);
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--color-primary, #2563eb);
      border: 1px solid transparent;
      color: #ffffff;
      padding: 8px 18px;
      border-radius: var(--radius-md, 8px);
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: all 0.15s ease;
    }

    .btn-primary:hover {
      background: var(--color-primary-hover, #1d4ed8);
    }

    .btn-primary:disabled, .btn-secondary:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      display: inline-block;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class SettingsSectionComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() icon = '';
  @Input() badge: string | number = '';
  @Input() isSaveable = false;
  @Input() saving = false;

  @Output() save = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
}
