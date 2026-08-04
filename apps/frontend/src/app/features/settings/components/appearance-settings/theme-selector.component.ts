import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeMode } from '../../models/user-settings.interface';

/**
 * ThemeSelectorComponent
 * Purpose: Visual theme picker card grid for selecting Light, Dark, or System mode.
 * Responsibilities: Render theme preview cards, active badges, and emit selection events.
 * Dependencies: ThemeMode type.
 */
@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="theme-selector-grid">
      <!-- Dark Theme Card -->
      <div
        class="theme-card"
        [class.active]="selectedTheme === 'dark'"
        (click)="onSelect('dark')"
      >
        <div class="theme-preview dark-preview">
          <div class="preview-header">
            <span class="preview-dot red"></span>
            <span class="preview-dot yellow"></span>
            <span class="preview-dot green"></span>
          </div>
          <div class="preview-body">
            <div class="preview-sidebar"></div>
            <div class="preview-content">
              <div class="preview-line w-75"></div>
              <div class="preview-line w-50"></div>
              <div class="preview-line w-90"></div>
            </div>
          </div>
        </div>
        <div class="theme-label-row">
          <div class="theme-info">
            <span class="theme-title">Dark Theme</span>
            <span class="theme-desc">High contrast dark background for night coding</span>
          </div>
          <span class="active-badge" *ngIf="selectedTheme === 'dark'">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
        </div>
      </div>

      <!-- Light Theme Card -->
      <div
        class="theme-card"
        [class.active]="selectedTheme === 'light'"
        (click)="onSelect('light')"
      >
        <div class="theme-preview light-preview">
          <div class="preview-header">
            <span class="preview-dot red"></span>
            <span class="preview-dot yellow"></span>
            <span class="preview-dot green"></span>
          </div>
          <div class="preview-body">
            <div class="preview-sidebar"></div>
            <div class="preview-content">
              <div class="preview-line w-75"></div>
              <div class="preview-line w-50"></div>
              <div class="preview-line w-90"></div>
            </div>
          </div>
        </div>
        <div class="theme-label-row">
          <div class="theme-info">
            <span class="theme-title">Light Theme</span>
            <span class="theme-desc">Clean, high legibility daytime theme</span>
          </div>
          <span class="active-badge" *ngIf="selectedTheme === 'light'">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
        </div>
      </div>

      <!-- System Theme Card -->
      <div
        class="theme-card"
        [class.active]="selectedTheme === 'system'"
        (click)="onSelect('system')"
      >
        <div class="theme-preview system-preview">
          <div class="preview-split dark-half">
            <div class="preview-line w-75"></div>
            <div class="preview-line w-50"></div>
          </div>
          <div class="preview-split light-half">
            <div class="preview-line w-75"></div>
            <div class="preview-line w-50"></div>
          </div>
        </div>
        <div class="theme-label-row">
          <div class="theme-info">
            <span class="theme-title">System Theme</span>
            <span class="theme-desc">Sync automatically with your operating system</span>
          </div>
          <span class="active-badge" *ngIf="selectedTheme === 'system'">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .theme-selector-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    @media (max-width: 768px) {
      .theme-selector-grid {
        grid-template-columns: 1fr;
      }
    }

    .theme-card {
      background: var(--bg-surface, #ffffff);
      border: 2px solid var(--border-color, #e5e7eb);
      border-radius: var(--radius-lg, 12px);
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      box-shadow: var(--shadow-xs);
    }

    .theme-card:hover {
      border-color: var(--border-medium, #d1d5db);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    .theme-card.active {
      border-color: var(--color-primary, #2563eb);
      background: var(--color-primary-light, #eff6ff);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    .theme-preview {
      height: 90px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 12px;
      border: 1px solid var(--border-color, #e5e7eb);
      display: flex;
      flex-direction: column;
    }

    .dark-preview {
      background: #0f172a;
    }

    .light-preview {
      background: #f8fafc;
    }

    .system-preview {
      display: flex;
      flex-direction: row;
    }

    .preview-split {
      flex: 1;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .preview-split.dark-half {
      background: #0f172a;
    }

    .preview-split.light-half {
      background: #f8fafc;
    }

    .preview-header {
      height: 18px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(0, 0, 0, 0.1);
    }

    .preview-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    .preview-dot.red { background: #ef4444; }
    .preview-dot.yellow { background: #f59e0b; }
    .preview-dot.green { background: #10b981; }

    .preview-body {
      flex: 1;
      display: flex;
    }

    .preview-sidebar {
      width: 24px;
      background: rgba(0, 0, 0, 0.05);
      border-right: 1px solid rgba(0, 0, 0, 0.05);
    }

    .dark-preview .preview-sidebar {
      background: rgba(255, 255, 255, 0.05);
      border-right-color: rgba(255, 255, 255, 0.05);
    }

    .preview-content {
      flex: 1;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .preview-line {
      height: 6px;
      border-radius: 3px;
      background: rgba(37, 99, 235, 0.4);
    }

    .preview-line.w-75 { width: 75%; }
    .preview-line.w-50 { width: 50%; }
    .preview-line.w-90 { width: 90%; }

    .theme-label-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .theme-info {
      display: flex;
      flex-direction: column;
    }

    .theme-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary, #111827);
    }

    .theme-desc {
      font-size: 0.75rem;
      color: var(--text-muted, #6b7280);
      margin-top: 2px;
    }

    .active-badge {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--color-primary, #2563eb);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
  `],
})
export class ThemeSelectorComponent {
  @Input() selectedTheme: ThemeMode = 'light';
  @Output() themeSelect = new EventEmitter<ThemeMode>();

  onSelect(theme: ThemeMode): void {
    this.themeSelect.emit(theme);
  }
}
