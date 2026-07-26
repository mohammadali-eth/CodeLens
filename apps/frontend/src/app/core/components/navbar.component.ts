import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * NavbarComponent
 * Purpose: Top Enterprise Navigation Bar for CodeLens Platform.
 * Responsibilities: Global brand header, navigation links (Dashboard, Workspace, Reviews, Chat, History), user profile widget.
 * Dependencies: Angular CommonModule, Angular RouterModule.
 */
@Component({
  selector: 'cdl-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="cdl-navbar">
      <div class="brand-section">
        <div class="brand-logo">🔍</div>
        <span class="brand-title">CodeLens</span>
        <span class="version-tag">v1.0.0</span>
      </div>

      <nav class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <span class="icon">📊</span>
          <span>Dashboard</span>
        </a>
        <a routerLink="/workspace" routerLinkActive="active" class="nav-item">
          <span class="icon">💻</span>
          <span>Workspace</span>
        </a>
        <a routerLink="/reviews" routerLinkActive="active" class="nav-item">
          <span class="icon">🔍</span>
          <span>Review Results</span>
        </a>
        <a routerLink="/chat" routerLinkActive="active" class="nav-item">
          <span class="icon">💬</span>
          <span>AI Chat</span>
        </a>
        <a routerLink="/history" routerLinkActive="active" class="nav-item">
          <span class="icon">📜</span>
          <span>History</span>
        </a>
      </nav>

      <div class="user-widget">
        <div class="user-avatar">MA</div>
        <div class="user-info">
          <span class="user-name">Mohammad Ali</span>
          <span class="user-role">Senior SRE / Architect</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .cdl-navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 1.5rem;
      background: #0f172a;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      color: #f8fafc;
      font-family: inherit;
    }
    .brand-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .brand-logo {
      font-size: 1.5rem;
    }
    .brand-title {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .version-tag {
      font-size: 0.7rem;
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-weight: 600;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 0.85rem;
      border-radius: 6px;
      color: #94a3b8;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .nav-item:hover {
      color: #f8fafc;
      background: rgba(255, 255, 255, 0.05);
    }
    .nav-item.active {
      color: #818cf8;
      background: rgba(99, 102, 241, 0.15);
      font-weight: 600;
    }
    .user-widget {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 700;
    }
    .user-info {
      display: flex;
      flex-direction: column;
    }
    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #f8fafc;
    }
    .user-role {
      font-size: 0.7rem;
      color: #64748b;
    }
  `],
})
export class NavbarComponent {}
