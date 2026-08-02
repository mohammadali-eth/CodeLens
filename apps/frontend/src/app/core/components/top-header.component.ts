import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';

/**
 * TopHeaderComponent
 * Purpose: Sticky Top Control Header Bar inspired by Stripe Dashboard, Vercel, and Linear.
 * Responsibilities: Breadcrumbs, global command palette search trigger (Cmd+K), notification bell, environment tag, and CTA.
 */
@Component({
  selector: 'cdl-top-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="cdl-top-header">
      <!-- Breadcrumbs -->
      <div class="header-left">
        <nav class="breadcrumbs">
          <a routerLink="/" class="crumb-root">CodeLens</a>
          <span class="crumb-separator">/</span>
          <span class="crumb-active">Enterprise Workspace</span>
        </nav>
        <span class="env-chip">
          <span class="dot"></span>
          <span>Prod :: US-East</span>
        </span>
      </div>

      <!-- Center Search Command Palette Bar -->
      <div class="header-center">
        <div class="search-command-bar">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search reviews, code files, or AI analysis..." class="search-input" />
          <kbd class="command-kbd">⌘K</kbd>
        </div>
      </div>

      <!-- Right Action Tools -->
      <div class="header-right">
        <button class="tool-btn" (click)="themeService.toggleTheme()" title="Toggle Theme" aria-label="Toggle Theme">
          <svg *ngIf="themeService.currentTheme() === 'dark'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
          </svg>
          <svg *ngIf="themeService.currentTheme() === 'light'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <button class="tool-btn" title="System Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span class="notification-badge"></span>
        </button>

        <a routerLink="/workspace" class="btn btn-primary btn-sm">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>New AI Review</span>
        </a>
      </div>
    </header>
  `,
  styles: [`
    .cdl-top-header {
      height: 56px;
      padding: 0 1.5rem;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 90;
    }

    :host-context([data-theme="dark"]) .cdl-top-header {
      background: rgba(15, 23, 42, 0.85);
      border-bottom-color: #334155;
    }

    .header-left { display: flex; align-items: center; gap: 0.85rem; }
    .breadcrumbs { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; }
    .crumb-root { color: var(--text-muted); font-weight: 500; text-decoration: none; }
    .crumb-root:hover { color: #2563eb; }
    .crumb-separator { color: var(--border-medium); }
    .crumb-active { color: var(--text-primary); font-weight: 600; }
    :host-context([data-theme="dark"]) .crumb-active { color: #ffffff; }

    .env-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: var(--success-bg);
      border: 1px solid var(--success-border);
      color: var(--success-text);
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-full);
    }

    .env-chip .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--success);
      box-shadow: 0 0 6px var(--success);
    }

    .header-center { flex: 1; max-width: 440px; margin: 0 1.5rem; }

    .search-command-bar {
      position: relative;
      display: flex;
      align-items: center;
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.375rem 0.75rem;
      transition: all 0.15s ease;
    }
    :host-context([data-theme="dark"]) .search-command-bar { background: #0f172a; border-color: #334155; }

    .search-command-bar:focus-within {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    .search-icon { color: var(--text-muted); margin-right: 0.5rem; flex-shrink: 0; }

    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-primary);
      font-size: 0.85rem;
      outline: none;
    }
    :host-context([data-theme="dark"]) .search-input { color: #ffffff; }

    .search-input::placeholder { color: var(--text-subtle); }

    .command-kbd {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xs);
      color: var(--text-muted);
      font-size: 0.6875rem;
      font-weight: 600;
      padding: 0.1rem 0.35rem;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    }
    :host-context([data-theme="dark"]) .command-kbd { background: #1e293b; border-color: #334155; color: #94a3b8; }

    .header-right { display: flex; align-items: center; gap: 0.75rem; }

    .tool-btn {
      position: relative;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      width: 34px;
      height: 34px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      box-shadow: var(--shadow-xs);
    }
    :host-context([data-theme="dark"]) .tool-btn { background: #1e293b; border-color: #334155; color: #cbd5e1; }

    .tool-btn:hover {
      background: var(--bg-surface-secondary);
      color: var(--text-primary);
      border-color: var(--border-medium);
    }

    .notification-badge {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--color-primary);
      box-shadow: 0 0 6px var(--color-primary);
    }

    .btn-sm { padding: 0.4rem 0.85rem; font-size: 0.8rem; }
  `],
})
export class TopHeaderComponent {
  constructor(
    public themeService: ThemeService,
    public authService: AuthService
  ) {}
}
