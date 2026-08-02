import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'cdl-public-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="public-header">
      <div class="header-container">
        <!-- Logo -->
        <a routerLink="/" class="brand-link">
          <div class="logo-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#4F46E5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#0891B2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="brand-name">CodeLens</span>
          <span class="brand-badge">SaaS</span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav">
          <a routerLink="/features" routerLinkActive="active" class="nav-link">Features</a>
          <a routerLink="/pricing" routerLinkActive="active" class="nav-link">Pricing</a>
          <a routerLink="/about" routerLinkActive="active" class="nav-link">About</a>
          <a routerLink="/contact" routerLinkActive="active" class="nav-link">Contact</a>
          <a routerLink="/security" routerLinkActive="active" class="nav-link">Security</a>
        </nav>

        <!-- Right Side Actions -->
        <div class="header-actions">
          <!-- Theme Toggle -->
          <button
            class="action-icon-btn"
            (click)="themeService.toggleTheme()"
            [attr.aria-label]="themeService.currentTheme() === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'"
            [title]="themeService.currentTheme() === 'light' ? 'Dark Mode' : 'Light Mode'"
          >
            <!-- Sun icon when dark mode -->
            <svg *ngIf="themeService.currentTheme() === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>

            <!-- Moon icon when light mode -->
            <svg *ngIf="themeService.currentTheme() === 'light'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>

          <!-- Auth CTA Buttons -->
          <ng-container *ngIf="!authService.isAuthenticated(); else authUserBlock">
            <a routerLink="/login" class="btn-login">Log In</a>
            <a routerLink="/signup" class="btn-signup">Sign Up Free</a>
          </ng-container>
          <ng-template #authUserBlock>
            <a routerLink="/dashboard" class="btn-dashboard">Go to Dashboard →</a>
          </ng-template>

          <!-- Mobile Menu Hamburger Button -->
          <button
            class="mobile-menu-btn"
            (click)="toggleMobileMenu()"
            [attr.aria-label]="mobileMenuOpen() ? 'Close Menu' : 'Open Navigation Menu'"
          >
            <svg *ngIf="!mobileMenuOpen()" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            <svg *ngIf="mobileMenuOpen()" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div class="mobile-dropdown" *ngIf="mobileMenuOpen()">
        <nav class="mobile-nav">
          <a routerLink="/" (click)="closeMobileMenu()" class="mobile-nav-item">Home</a>
          <a routerLink="/features" (click)="closeMobileMenu()" class="mobile-nav-item">Features</a>
          <a routerLink="/pricing" (click)="closeMobileMenu()" class="mobile-nav-item">Pricing</a>
          <a routerLink="/about" (click)="closeMobileMenu()" class="mobile-nav-item">About</a>
          <a routerLink="/contact" (click)="closeMobileMenu()" class="mobile-nav-item">Contact</a>
          <a routerLink="/security" (click)="closeMobileMenu()" class="mobile-nav-item">Security</a>
          <a routerLink="/privacy" (click)="closeMobileMenu()" class="mobile-nav-item">Privacy Policy</a>
          <a routerLink="/terms" (click)="closeMobileMenu()" class="mobile-nav-item">Terms & Conditions</a>
          <div class="mobile-actions">
            <ng-container *ngIf="!authService.isAuthenticated(); else mobileAuthUserBlock">
              <a routerLink="/login" (click)="closeMobileMenu()" class="btn-login full-w">Log In</a>
              <a routerLink="/signup" (click)="closeMobileMenu()" class="btn-signup full-w">Sign Up Free</a>
            </ng-container>
            <ng-template #mobileAuthUserBlock>
              <a routerLink="/dashboard" (click)="closeMobileMenu()" class="btn-dashboard full-w">Go to Dashboard →</a>
            </ng-template>
          </div>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .public-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid #e5e7eb;
      transition: all 0.2s ease;
    }

    :host-context([data-theme="dark"]) .public-header {
      background: rgba(15, 23, 42, 0.88);
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }

    .header-container {
      max-width: 1280px;
      margin: 0 auto;
      height: 72px;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      text-decoration: none;
    }

    .logo-box {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.12);
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.025em;
    }

    :host-context([data-theme="dark"]) .brand-name {
      color: #f8fafc;
    }

    .brand-badge {
      font-size: 0.675rem;
      font-weight: 700;
      color: #2563eb;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      padding: 0.1rem 0.45rem;
      border-radius: 6px;
    }

    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    @media (max-width: 868px) {
      .desktop-nav {
        display: none;
      }
    }

    .nav-link {
      font-size: 0.9rem;
      font-weight: 500;
      color: #4b5563;
      text-decoration: none;
      transition: color 0.15s ease;
    }

    :host-context([data-theme="dark"]) .nav-link {
      color: #94a3b8;
    }

    .nav-link:hover, .nav-link.active {
      color: #2563eb;
      font-weight: 600;
    }

    :host-context([data-theme="dark"]) .nav-link:hover,
    :host-context([data-theme="dark"]) .nav-link.active {
      color: #60a5fa;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .action-icon-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #475569;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    :host-context([data-theme="dark"]) .action-icon-btn {
      background: #1e293b;
      border-color: #334155;
      color: #cbd5e1;
    }

    .action-icon-btn:hover {
      background: #f1f5f9;
      color: #111827;
      border-color: #cbd5e1;
    }

    .btn-login {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.15s ease;
    }

    :host-context([data-theme="dark"]) .btn-login {
      color: #e2e8f0;
    }

    .btn-login:hover {
      color: #2563eb;
      background: #f1f5f9;
    }

    .btn-signup, .btn-dashboard {
      font-size: 0.875rem;
      font-weight: 600;
      color: #ffffff;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      padding: 0.55rem 1.15rem;
      border-radius: 9px;
      text-decoration: none;
      box-shadow: 0 2px 10px rgba(37, 99, 235, 0.25);
      transition: all 0.18s ease;
    }

    .btn-signup:hover, .btn-dashboard:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
    }

    .mobile-menu-btn {
      display: none;
      background: transparent;
      border: none;
      color: #374151;
      cursor: pointer;
      padding: 0.4rem;
    }

    @media (max-width: 868px) {
      .mobile-menu-btn {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .btn-login, .btn-signup {
        display: none;
      }
    }

    .mobile-dropdown {
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 1.5rem 1.5rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    :host-context([data-theme="dark"]) .mobile-dropdown {
      background: #0f172a;
      border-bottom-color: #334155;
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .mobile-nav-item {
      font-size: 1rem;
      font-weight: 500;
      color: #374151;
      text-decoration: none;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    :host-context([data-theme="dark"]) .mobile-nav-item {
      color: #cbd5e1;
      border-bottom-color: #1e293b;
    }

    .mobile-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .full-w {
      width: 100%;
      text-align: center;
      box-sizing: border-box;
      display: block;
    }
  `],
})
export class PublicHeaderComponent {
  public mobileMenuOpen = signal<boolean>(false);

  constructor(
    public themeService: ThemeService,
    public authService: AuthService
  ) {}

  public toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  public closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
