import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * SidebarComponent
 * Purpose: Enterprise Sidebar Shell inspired by Google Cloud Console, Vercel, Linear, Stripe, and GitHub.
 * Features: Light background (#ffffff), 280px width, 46px item height, rounded 10px items, grouped sections,
 * active indicator (#2563eb), collapse toggle (280px <-> 76px), tooltips on collapse, and pinned user footer.
 */
@Component({
  selector: 'cdl-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      class="cdl-sidebar"
      [class.collapsed]="isCollapsed()"
      role="navigation"
      aria-label="Main Navigation"
    >
      <!-- Top Branding Section -->
      <div class="sidebar-branding">
        <div class="brand-container" *ngIf="!isCollapsed()">
          <div class="logo-mark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#4F46E5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#0891B2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <div class="brand-info">
            <div class="brand-row">
              <span class="brand-title">CodeLens</span>
              <span class="brand-badge">Enterprise</span>
            </div>
            <span class="brand-subtext">AI Code Review Platform</span>
          </div>
        </div>

        <!-- Logo Mark shown centered in collapsed state -->
        <div class="collapsed-logo-mark" *ngIf="isCollapsed()" (click)="toggleCollapse()" title="Expand sidebar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="#4F46E5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#0891B2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <button
          class="collapse-btn"
          (click)="toggleCollapse()"
          [attr.aria-label]="isCollapsed() ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'"
          [title]="isCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path [attr.d]="isCollapsed() ? 'M13 17l5-5-5-5M6 17l5-5-5-5' : 'M11 19l-7-7 7-7M18 19l-7-7 7-7'" />
          </svg>
        </button>
      </div>

      <!-- Main Navigation Menu with Grouped Sections -->
      <nav class="nav-scroll-area">
        <!-- Section 1: WORKSPACE -->
        <div class="nav-section">
          <div class="section-label" *ngIf="!isCollapsed()">WORKSPACE</div>

          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link" [title]="isCollapsed() ? 'Analytics Dashboard' : ''">
            <div class="link-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="9" rx="1.5" />
                <rect x="14" y="3" width="7" height="5" rx="1.5" />
                <rect x="14" y="12" width="7" height="9" rx="1.5" />
                <rect x="3" y="16" width="7" height="5" rx="1.5" />
              </svg>
            </div>
            <span class="link-label" *ngIf="!isCollapsed()">Analytics Dashboard</span>
            <div class="active-indicator"></div>
          </a>

          <a routerLink="/workspace" routerLinkActive="active" class="nav-link" [title]="isCollapsed() ? 'Code Workspace' : ''">
            <div class="link-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <span class="link-label" *ngIf="!isCollapsed()">Code Workspace</span>
            <span class="chip chip-blue" *ngIf="!isCollapsed()">IDE</span>
            <div class="active-indicator"></div>
          </a>

          <a routerLink="/reviews" routerLinkActive="active" class="nav-link" [title]="isCollapsed() ? 'AI Review Results' : ''">
            <div class="link-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <span class="link-label" *ngIf="!isCollapsed()">AI Review Results</span>
            <div class="active-indicator"></div>
          </a>
        </div>

        <!-- Section 2: DEVELOPMENT -->
        <div class="nav-section">
          <div class="section-label" *ngIf="!isCollapsed()">DEVELOPMENT</div>

          <a routerLink="/pull-requests" routerLinkActive="active" class="nav-link" [title]="isCollapsed() ? 'Pull Requests' : ''">
            <div class="link-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="18" r="3" />
                <circle cx="6" cy="6" r="3" />
                <path d="M13 6h3a2 2 0 0 1 2 2v7" />
                <line x1="6" y1="9" x2="6" y2="21" />
              </svg>
            </div>
            <span class="link-label" *ngIf="!isCollapsed()">Pull Requests</span>
            <span class="count-badge" *ngIf="!isCollapsed()">4</span>
            <div class="active-indicator"></div>
          </a>

          <a routerLink="/ai-analysis" routerLinkActive="active" class="nav-link" [title]="isCollapsed() ? 'AI Analysis' : ''">
            <div class="link-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span class="link-label" *ngIf="!isCollapsed()">AI Analysis</span>
            <div class="active-indicator"></div>
          </a>

          <a routerLink="/security-scan" routerLinkActive="active" class="nav-link" [title]="isCollapsed() ? 'Security Scan' : ''">
            <div class="link-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span class="link-label" *ngIf="!isCollapsed()">Security Scan</span>
            <span class="chip chip-green" *ngIf="!isCollapsed()">Pass</span>
            <div class="active-indicator"></div>
          </a>
        </div>

        <!-- Section 3: INSIGHTS -->
        <div class="nav-section">
          <div class="section-label" *ngIf="!isCollapsed()">INSIGHTS</div>

          <a routerLink="/chat" routerLinkActive="active" class="nav-link" [title]="isCollapsed() ? 'AI Chat Assistant' : ''">
            <div class="link-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span class="link-label" *ngIf="!isCollapsed()">AI Chat Assistant</span>
            <span class="chip chip-live" *ngIf="!isCollapsed()">LIVE</span>
            <div class="active-indicator"></div>
          </a>

          <a routerLink="/history" routerLinkActive="active" class="nav-link" [title]="isCollapsed() ? 'Review History' : ''">
            <div class="link-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span class="link-label" *ngIf="!isCollapsed()">Review History</span>
            <div class="active-indicator"></div>
          </a>
        </div>

        <!-- Section 4: MANAGEMENT -->
        <div class="nav-section">
          <div class="section-label" *ngIf="!isCollapsed()">MANAGEMENT</div>

          <a routerLink="/team" routerLinkActive="active" class="nav-link" [title]="isCollapsed() ? 'Team & Members' : ''">
            <div class="link-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span class="link-label" *ngIf="!isCollapsed()">Team & Members</span>
            <div class="active-indicator"></div>
          </a>

          <a routerLink="/integrations" routerLinkActive="active" class="nav-link" [title]="isCollapsed() ? 'Integrations' : ''">
            <div class="link-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="8" height="8" rx="2" />
                <rect x="14" y="2" width="8" height="8" rx="2" />
                <rect x="14" y="14" width="8" height="8" rx="2" />
                <rect x="2" y="14" width="8" height="8" rx="2" />
              </svg>
            </div>
            <span class="link-label" *ngIf="!isCollapsed()">Integrations</span>
            <div class="active-indicator"></div>
          </a>
        </div>
      </nav>

      <!-- Pinned Bottom User & Quick Settings Section -->
      <div class="sidebar-footer">
        <div class="user-profile-row" [title]="isCollapsed() ? 'Mohammad Ali (Principal SRE)' : ''">
          <div class="avatar-container">
            <div class="avatar-circle">MA</div>
            <span class="status-indicator"></span>
          </div>

          <div class="user-meta" *ngIf="!isCollapsed()">
            <span class="user-fullname">Mohammad Ali</span>
            <span class="user-jobtitle">Principal SRE & Architect</span>
          </div>

          <div class="footer-actions" *ngIf="!isCollapsed()">
            <button class="footer-btn" title="Toggle Theme" aria-label="Toggle Theme">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </button>

            <button class="footer-btn" title="Settings" aria-label="Settings">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      position: sticky;
      top: 0;
      z-index: 100;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .cdl-sidebar {
      width: 280px;
      height: 100%;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
      box-sizing: border-box;
      overflow: hidden;
    }

    .cdl-sidebar.collapsed {
      width: 76px;
    }

    /* Top Branding Bar */
    .sidebar-branding {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.125rem 1rem;
      height: 70px;
      box-sizing: border-box;
    }

    .cdl-sidebar.collapsed .sidebar-branding {
      justify-content: center;
      padding: 1.25rem 0 1rem;
    }

    .brand-container {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      min-width: 0;
    }

    .logo-mark, .collapsed-logo-mark {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.2s ease;
      cursor: pointer;
    }

    .logo-mark:hover, .collapsed-logo-mark:hover {
      transform: scale(1.04);
      background: #dbeafe;
    }

    .brand-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }

    .brand-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.02em;
    }

    .brand-badge {
      font-size: 0.65rem;
      font-weight: 700;
      color: #2563eb;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      letter-spacing: 0.02em;
    }

    .brand-subtext {
      font-size: 0.725rem;
      color: #6b7280;
      font-weight: 500;
      white-space: nowrap;
    }

    .collapse-btn {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #64748b;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.18s ease;
      flex-shrink: 0;
    }

    .cdl-sidebar.collapsed .collapse-btn {
      display: none;
    }

    .collapse-btn:hover {
      background: #f1f5f9;
      color: #1e293b;
      border-color: #cbd5e1;
    }

    .collapse-btn:focus-visible {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
    }

    /* Scrollable Navigation Area */
    .nav-scroll-area {
      flex: 1;
      padding: 0.5rem 0.85rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.125rem;
    }

    .cdl-sidebar.collapsed .nav-scroll-area {
      padding: 0.5rem 0;
      align-items: center;
    }

    .nav-section {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      width: 100%;
    }

    .cdl-sidebar.collapsed .nav-section {
      align-items: center;
    }

    .section-label {
      font-size: 0.675rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #9ca3af;
      padding: 0.25rem 0.75rem 0.4rem;
    }

    /* Navigation Link Items */
    .nav-link {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      height: 46px;
      padding: 0 0.85rem;
      border-radius: 10px;
      color: #4b5563;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
      width: 100%;
    }

    .cdl-sidebar.collapsed .nav-link {
      width: 44px;
      height: 44px;
      padding: 0;
      justify-content: center;
      margin: 0 auto;
    }

    .nav-link:hover {
      background: #f1f5f9;
      color: #111827;
    }

    .nav-link:focus-visible {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
    }

    .nav-link.active {
      background: #eff6ff;
      color: #2563eb;
      font-weight: 600;
    }

    .link-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      flex-shrink: 0;
      transition: color 0.18s ease, transform 0.18s ease;
    }

    .nav-link:hover .link-icon {
      color: #111827;
      transform: scale(1.05);
    }

    .nav-link.active .link-icon {
      color: #2563eb;
    }

    .link-label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Chips & Badges */
    .chip {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 6px;
      line-height: 1;
      letter-spacing: 0.02em;
    }

    .chip-blue {
      background: #dbeafe;
      color: #1e40af;
    }

    .chip-green {
      background: #d1fae5;
      color: #065f46;
    }

    .chip-live {
      background: #fee2e2;
      color: #b91c1c;
      animation: pulse-live 2s infinite;
    }

    @keyframes pulse-live {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.65; }
    }

    .count-badge {
      font-size: 0.7rem;
      font-weight: 700;
      background: #f1f5f9;
      color: #475569;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
    }

    .active-indicator {
      display: none;
      position: absolute;
      left: 0;
      top: 20%;
      bottom: 20%;
      width: 3.5px;
      background: #2563eb;
      border-radius: 0 4px 4px 0;
    }

    .nav-link.active .active-indicator {
      display: block;
    }

    .cdl-sidebar.collapsed .active-indicator {
      left: -14px;
    }

    /* Pinned Bottom Footer */
    .sidebar-footer {
      padding: 0.85rem 1.125rem;
      border-top: 1px solid #e5e7eb;
      background: #ffffff;
      box-sizing: border-box;
    }

    .cdl-sidebar.collapsed .sidebar-footer {
      padding: 0.85rem 0;
      display: flex;
      justify-content: center;
    }

    .user-profile-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
    }

    .cdl-sidebar.collapsed .user-profile-row {
      justify-content: center;
    }

    .avatar-container {
      position: relative;
      flex-shrink: 0;
    }

    .avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
      color: #ffffff;
      font-size: 0.8rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
    }

    .status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #10b981;
      border: 2px solid #ffffff;
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .user-fullname {
      font-size: 0.825rem;
      font-weight: 600;
      color: #111827;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-jobtitle {
      font-size: 0.675rem;
      color: #6b7280;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .footer-actions {
      display: flex;
      gap: 0.25rem;
    }

    .footer-btn {
      background: transparent;
      border: none;
      color: #9ca3af;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .footer-btn:hover {
      background: #f1f5f9;
      color: #111827;
    }

    .footer-btn:focus-visible {
      outline: 2px solid #2563eb;
    }
  `],
})
export class SidebarComponent {
  public isCollapsed = signal<boolean>(false);

  public toggleCollapse(): void {
    this.isCollapsed.update((val) => !val);
  }
}
