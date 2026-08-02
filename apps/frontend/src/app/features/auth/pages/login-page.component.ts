import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'cdl-login-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-container">
      <div class="ambient-glow glow-top"></div>
      <div class="ambient-glow glow-bottom"></div>

      <div class="login-card-wrapper animate-fade-in">
        <div class="login-header">
          <a routerLink="/" class="logo-box" title="Return to Home">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#4F46E5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#0891B2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <h1 class="auth-title">Welcome to CodeLens</h1>
          <p class="auth-subtitle">Sign in to your Enterprise AI Code Review Workspace</p>
        </div>

        <div class="sso-buttons">
          <button type="button" class="sso-btn" (click)="onSocialLogin('GitHub')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            Continue with GitHub
          </button>

          <button type="button" class="sso-btn" (click)="onSocialLogin('Google')">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div class="divider">
          <span class="divider-text">OR EMAIL LOGIN</span>
        </div>

        <form (submit)="onLogin($event)" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Work Email</label>
            <input
              id="email"
              type="email"
              class="form-input"
              placeholder="name@company.com"
              [(ngModel)]="email"
              name="email"
              required
            />
          </div>

          <div class="form-group">
            <div class="label-row">
              <label for="password" class="form-label">Password</label>
              <a routerLink="/forgot-password" class="forgot-link">Forgot password?</a>
            </div>

            <div class="input-relative">
              <input
                id="password"
                [attr.type]="showPassword() ? 'text' : 'password'"
                class="form-input pwd-input"
                placeholder="••••••••••••"
                [(ngModel)]="password"
                name="password"
                required
              />
              <button
                type="button"
                class="toggle-pwd-btn"
                (click)="togglePasswordVisibility($event)"
                [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
              >
                <svg *ngIf="showPassword()" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>

                <svg *ngIf="!showPassword()" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <span class="btn-text">{{ showPassword() ? 'Hide' : 'Show' }}</span>
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary submit-btn" [disabled]="isLoading()">
            <span *ngIf="!isLoading()">Sign In to Dashboard</span>
            <span *ngIf="isLoading()">Signing in...</span>
          </button>
        </form>

        <div class="login-footer">
          <p class="signup-prompt">
            Don't have an account? <a routerLink="/signup" class="signup-link">Create Account</a>
          </p>
          <div class="security-badges">
            <span class="sec-badge">🔒 SOC2 Type II Certified</span>
            <span class="sec-badge">⚡ 256-bit AES</span>
          </div>
          <div class="home-back-link">
            <a routerLink="/">← Back to Public Website</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      width: 100%;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, sans-serif;
    }

    :host-context([data-theme="dark"]) .login-container { background: #0f172a; }

    .ambient-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: 0.35;
      pointer-events: none;
    }

    .glow-top {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, #2563eb 0%, rgba(37, 99, 235, 0) 70%);
      top: -100px;
      right: -100px;
    }

    .glow-bottom {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, #4f46e5 0%, rgba(79, 70, 229, 0) 70%);
      bottom: -150px;
      left: -150px;
    }

    .login-card-wrapper {
      width: 100%;
      max-width: 440px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 2.25rem;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
      position: relative;
      z-index: 10;
    }
    :host-context([data-theme="dark"]) .login-card-wrapper { background: #1e293b; border-color: #334155; }

    .login-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 1.75rem;
    }

    .logo-box {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
      text-decoration: none;
    }

    .auth-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.35rem;
      letter-spacing: -0.02em;
    }
    :host-context([data-theme="dark"]) .auth-title { color: #ffffff; }

    .auth-subtitle { font-size: 0.875rem; color: #6b7280; margin: 0; }
    :host-context([data-theme="dark"]) .auth-subtitle { color: #94a3b8; }

    .sso-buttons { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem; }

    .sso-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      width: 100%;
      height: 44px;
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    :host-context([data-theme="dark"]) .sso-btn { background: #0f172a; border-color: #334155; color: #cbd5e1; }
    .sso-btn:hover { background: #f8fafc; border-color: #9ca3af; color: #111827; }

    .divider { position: relative; text-align: center; margin: 1.5rem 0; }
    .divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #e5e7eb; }
    :host-context([data-theme="dark"]) .divider::before { background: #334155; }
    .divider-text { position: relative; background: #ffffff; padding: 0 0.75rem; font-size: 0.675rem; font-weight: 700; color: #9ca3af; letter-spacing: 0.08em; }
    :host-context([data-theme="dark"]) .divider-text { background: #1e293b; }

    .login-form { display: flex; flex-direction: column; gap: 1.125rem; }

    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .label-row { display: flex; align-items: center; justify-content: space-between; }
    .form-label { font-size: 0.825rem; font-weight: 600; color: #374151; }
    :host-context([data-theme="dark"]) .form-label { color: #cbd5e1; }
    .forgot-link { font-size: 0.775rem; color: #2563eb; text-decoration: none; font-weight: 500; }
    .forgot-link:hover { text-decoration: underline; }

    .input-relative { position: relative; display: flex; align-items: center; width: 100%; }
    .pwd-input { padding-right: 4.5rem !important; }

    .toggle-pwd-btn {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      color: #2563eb;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      cursor: pointer;
    }

    .form-options { display: flex; align-items: center; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #4b5563; cursor: pointer; }
    :host-context([data-theme="dark"]) .checkbox-label { color: #94a3b8; }

    .submit-btn { height: 46px; font-size: 0.95rem; font-weight: 600; margin-top: 0.5rem; width: 100%; }

    .login-footer {
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid #f1f5f9;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      text-align: center;
    }
    :host-context([data-theme="dark"]) .login-footer { border-top-color: #334155; }

    .signup-prompt { font-size: 0.85rem; color: #6b7280; margin: 0; }
    :host-context([data-theme="dark"]) .signup-prompt { color: #94a3b8; }
    .signup-link { color: #2563eb; font-weight: 600; text-decoration: none; }
    .signup-link:hover { text-decoration: underline; }

    .security-badges { display: flex; gap: 0.5rem; }
    .sec-badge { font-size: 0.675rem; color: #6b7280; background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.15rem 0.5rem; border-radius: 6px; }
    :host-context([data-theme="dark"]) .sec-badge { background: #0f172a; border-color: #334155; color: #cbd5e1; }

    .home-back-link { margin-top: 0.5rem; }
    .home-back-link a { font-size: 0.8rem; color: #6b7280; text-decoration: none; }
    .home-back-link a:hover { color: #2563eb; text-decoration: underline; }
  `],
})
export class LoginPageComponent {
  public email = 'm.ali@codelens.io';
  public password = '••••••••••••';
  public rememberMe = true;
  public isLoading = signal<boolean>(false);
  public showPassword = signal<boolean>(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  public togglePasswordVisibility(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.showPassword.update((v) => !v);
  }

  public async onSocialLogin(provider: string): Promise<void> {
    this.isLoading.set(true);
    await this.authService.login(this.email, this.password);
    this.isLoading.set(false);
    this.redirectPostLogin();
  }

  public async onLogin(event: Event): Promise<void> {
    event.preventDefault();
    this.isLoading.set(true);
    await this.authService.login(this.email, this.password);
    this.isLoading.set(false);
    this.redirectPostLogin();
  }

  private redirectPostLogin(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.router.navigateByUrl(returnUrl);
  }
}
