import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SettingsNavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string | number;
  description?: string;
}

/**
 * SettingsSidebarComponent
 * Purpose: Navigation sidebar for switching settings categories.
 * Responsibilities: Render category items, filter query input, active tab highlight.
 * Dependencies: Angular CommonModule, FormsModule.
 */
@Component({
  selector: 'app-settings-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="settings-nav-card">
      <div class="search-box">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          class="search-input"
          placeholder="Filter settings..."
          [(ngModel)]="searchQuery"
          (ngModelChange)="onSearchChange($event)"
        />
        <button type="button" class="clear-btn" *ngIf="searchQuery" (click)="clearSearch()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="nav-section-title">CATEGORIES</div>

      <ul class="nav-list">
        <li *ngFor="let item of filteredNavItems" class="nav-item">
          <button
            type="button"
            class="nav-button"
            [class.active]="item.id === activeId"
            (click)="selectSection(item.id)"
          >
            <span class="btn-content">
              <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <ng-container [ngSwitch]="item.icon">
                  <path *ngSwitchCase="'tune'" d="M4 21v-7m0-4V3m8 21v-11m0-4V3m8 21v-9m0-4V3M1 14h6m2-6h6m2 8h6"/>
                  <path *ngSwitchCase="'palette'" d="M12 21a9 9 0 1 1 0-18c2 0 3.5 1 3.5 3 0 1.5-1 2.5-1 3.5 0 1.5 1.5 2 3 2h.5A4.5 4.5 0 0 1 21 16c0 2.8-4 5-9 5z"/>
                  <path *ngSwitchCase="'code'" d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
                  <path *ngSwitchCase="'psychology'" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                  <path *ngSwitchCase="'notifications'" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
                  <path *ngSwitchCase="'security'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path *ngSwitchCase="'privacy_tip'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 8v4m0 4h.01"/>
                  <path *ngSwitchCase="'key'" d="M21 2l-2 2m-1.5 1.5L14 9.5M9.5 14A5.5 5.5 0 1 1 15 8.5L22 15.5V20h-4.5v-2H15.5v-2.5L14 14"/>
                  <path *ngSwitchCase="'info'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 8v4m0 4h.01"/>
                  <path *ngSwitchDefault d="M12 2v20m10-10H2"/>
                </ng-container>
              </svg>
              <span class="nav-label">{{ item.label }}</span>
            </span>
            <span class="nav-badge" *ngIf="item.badge">{{ item.badge }}</span>
          </button>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .settings-nav-card {
      background: var(--bg-surface, #ffffff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: var(--radius-lg, 12px);
      padding: 16px;
      box-shadow: var(--shadow-sm, 0 1px 3px 0 rgba(15, 23, 42, 0.06));
      position: sticky;
      top: 80px;
    }

    .search-box {
      position: relative;
      margin-bottom: 16px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-subtle, #9ca3af);
    }

    .search-input {
      width: 100%;
      background: var(--bg-app, #f8fafc);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      padding: 8px 32px 8px 36px;
      color: var(--text-primary, #111827);
      font-size: 0.84375rem;
      outline: none;
      transition: all 0.15s ease;
    }

    .search-input:focus {
      border-color: var(--color-primary, #2563eb);
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    .clear-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-subtle, #9ca3af);
      cursor: pointer;
      padding: 2px;
      display: flex;
      align-items: center;
    }

    .clear-btn:hover {
      color: var(--text-primary, #111827);
    }

    .nav-section-title {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-subtle, #9ca3af);
      padding: 4px 8px 8px 8px;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: var(--radius-md, 8px);
      color: var(--text-secondary, #4b5563);
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s ease;
      text-align: left;
    }

    .nav-button:hover {
      background: var(--bg-surface-secondary, #f1f5f9);
      color: var(--text-primary, #111827);
    }

    .nav-button.active {
      background: var(--color-primary-light, #eff6ff);
      border-color: var(--color-primary-border, rgba(37, 99, 235, 0.25));
      color: var(--color-primary, #2563eb);
      font-weight: 600;
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .nav-icon {
      flex-shrink: 0;
    }

    .nav-badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 10px;
      background: var(--color-primary-light, #eff6ff);
      color: var(--color-primary, #2563eb);
    }
  `],
})
export class SettingsSidebarComponent {
  @Input() activeId = 'general';
  @Input() navItems: SettingsNavItem[] = [
    { id: 'general', label: 'General', icon: 'tune' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
    { id: 'editor', label: 'Editor Preferences', icon: 'code' },
    { id: 'ai', label: 'AI Preferences', icon: 'psychology' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'security', label: 'Security & Sessions', icon: 'security' },
    { id: 'privacy', label: 'Privacy & Data', icon: 'privacy_tip' },
    { id: 'apikeys', label: 'API Keys', icon: 'key' },
    { id: 'about', label: 'About CodeLens', icon: 'info' },
  ];

  @Output() sectionChange = new EventEmitter<string>();

  searchQuery = '';

  get filteredNavItems(): SettingsNavItem[] {
    if (!this.searchQuery.trim()) {
      return this.navItems;
    }
    const q = this.searchQuery.toLowerCase();
    return this.navItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    );
  }

  selectSection(id: string): void {
    this.sectionChange.emit(id);
  }

  onSearchChange(query: string): void {
    // Search filter callback
  }

  clearSearch(): void {
    this.searchQuery = '';
  }
}
