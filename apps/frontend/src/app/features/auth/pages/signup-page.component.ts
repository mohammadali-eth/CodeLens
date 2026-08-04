import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'cdl-signup-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="signup-container">
      <div class="ambient-glow glow-top"></div>
      <div class="ambient-glow glow-bottom"></div>

      <div class="signup-card-wrapper animate-fade-in">
        <div class="signup-header">
          <a routerLink="/" class="logo-box" title="Return to Home">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#4F46E5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#0891B2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <h1 class="auth-title">Create your Account</h1>
          <p class="auth-subtitle">Start reviewing code with Enterprise AI in seconds</p>
        </div>

        <div *ngIf="errorMessage()" class="error-banner animate-fade-in" role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ errorMessage() }}</span>
        </div>

        <div class="sso-buttons">
          <button type="button" class="sso-btn" (click)="onSocialSignUp('GitHub')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            Sign up with GitHub
          </button>

          <button type="button" class="sso-btn" (click)="onSocialSignUp('Google')">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Sign up with Google
          </button>
        </div>

        <div class="divider">
          <span class="divider-text">OR REGISTER WITH EMAIL</span>
        </div>

        <form (submit)="onSignUp($event)" class="signup-form">
          <div class="name-row">
            <div class="form-group">
              <label for="firstName" class="form-label">First Name</label>
              <input
                id="firstName"
                type="text"
                class="form-input"
                placeholder="Mohammad"
                [(ngModel)]="firstName"
                name="firstName"
                required
              />
            </div>

            <div class="form-group">
              <label for="lastName" class="form-label">Last Name</label>
              <input
                id="lastName"
                type="text"
                class="form-input"
                placeholder="Ali"
                [(ngModel)]="lastName"
                name="lastName"
                required
              />
            </div>
          </div>

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
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Create Password</label>
            <div class="input-relative">
              <input
                id="password"
                [attr.type]="showPassword() ? 'text' : 'password'"
                class="form-input pwd-input"
                placeholder="At least 8 characters"
                [(ngModel)]="password"
                name="password"
                required
                (ngModelChange)="onPasswordInput()"
              />
              <button
                type="button"
                class="toggle-pwd-btn"
                (click)="togglePasswordVisibility($event)"
              >
                <span>{{ showPassword() ? 'Hide' : 'Show' }}</span>
              </button>
            </div>

            <!-- Password Strength Bar -->
            <div *ngIf="password.length > 0" class="strength-meter">
              <div class="strength-bar-bg">
                <div class="strength-bar-fill" [style.width.%]="strengthPercent()" [class]="strengthClass()"></div>
              </div>
              <span class="strength-text">{{ strengthLabel() }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              class="form-input"
              placeholder="Repeat your password"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              required
            />
            <span *ngIf="confirmPassword.length > 0 && password !== confirmPassword" class="field-error">
              Passwords do not match
            </span>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="agreeTerms" name="agreeTerms" required />
              <span>I agree to the <a routerLink="/terms">Terms of Service</a> and <a routerLink="/privacy">Privacy Policy</a></span>
            </label>
          </div>

          <button
            type="submit"
            class="btn btn-primary submit-btn"
            [disabled]="isLoading() || !isFormValid()"
          >
            <span *ngIf="!isLoading()">Create Enterprise Account</span>
            <span *ngIf="isLoading()">Creating account...</span>
          </button>
        </form>

        <div class="signup-footer">
          <p class="signin-prompt">
            Already have an account? <a routerLink="/login" class="signin-link">Sign In</a>
          </p>
          <div class="home-back-link">
            <a routerLink="/">← Back to Public Website</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .signup-container {
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
    :host-context([data-theme="dark"]) .signup-container { background: #0f172a; }

    .ambient-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: 0.35;
      pointer-events: none;
    }

    .glow-top { width: 400px; height: 400px; background: radial-gradient(circle, #2563eb 0%, rgba(37, 99, 235, 0) 70%); top: -100px; right: -100px; }
    .glow-bottom { width: 500px; height: 500px; background: radial-gradient(circle, #4f46e5 0%, rgba(79, 70, 229, 0) 70%); bottom: -150px; left: -150px; }

    .signup-card-wrapper {
      width: 100%;
      max-width: 480px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 2.25rem;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
      position: relative;
      z-index: 10;
    }
    :host-context([data-theme="dark"]) .signup-card-wrapper { background: #1e293b; border-color: #334155; }

    .signup-header { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 1.5rem; }
    .logo-box { width: 52px; height: 52px; border-radius: 14px; background: #eff6ff; border: 1px solid #dbeafe; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; text-decoration: none; }
    .auth-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0 0 0.35rem; }
    :host-context([data-theme="dark"]) .auth-title { color: #ffffff; }
    .auth-subtitle { font-size: 0.875rem; color: #6b7280; margin: 0; }
    :host-context([data-theme="dark"]) .auth-subtitle { color: #94a3b8; }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      font-size: 0.825rem;
      font-weight: 500;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      margin-bottom: 1.25rem;
    }
    :host-context([data-theme="dark"]) .error-banner {
      background: rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.3);
      color: #fca5a5;
    }

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
    }
    :host-context([data-theme="dark"]) .sso-btn { background: #0f172a; border-color: #334155; color: #cbd5e1; }
    .sso-btn:hover { background: #f8fafc; color: #111827; }

    .divider { position: relative; text-align: center; margin: 1.25rem 0; }
    .divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #e5e7eb; }
    :host-context([data-theme="dark"]) .divider::before { background: #334155; }
    .divider-text { position: relative; background: #ffffff; padding: 0 0.75rem; font-size: 0.65rem; font-weight: 700; color: #9ca3af; letter-spacing: 0.08em; }
    :host-context([data-theme="dark"]) .divider-text { background: #1e293b; }

    .signup-form { display: flex; flex-direction: column; gap: 1rem; }
    .name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
    .form-label { font-size: 0.825rem; font-weight: 600; color: #374151; }
    :host-context([data-theme="dark"]) .form-label { color: #cbd5e1; }

    .form-input {
      width: 100%;
      height: 42px;
      padding: 0 0.875rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.875rem;
      color: #111827;
      background: #ffffff;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      box-sizing: border-box;
    }
    :host-context([data-theme="dark"]) .form-input {
      background: #0f172a;
      border-color: #334155;
      color: #f8fafc;
    }
    .form-input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

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
      cursor: pointer;
    }
    :host-context([data-theme="dark"]) .toggle-pwd-btn {
      background: #1e293b;
      border-color: #334155;
      color: #60a5fa;
    }

    .strength-meter {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.35rem;
    }

    .strength-bar-bg {
      flex: 1;
      height: 4px;
      background: #e2e8f0;
      border-radius: 2px;
      overflow: hidden;
    }
    :host-context([data-theme="dark"]) .strength-bar-bg { background: #334155; }

    .strength-bar-fill {
      height: 100%;
      transition: width 0.2s ease, background-color 0.2s ease;
    }

    .strength-weak { background-color: #ef4444; }
    .strength-medium { background-color: #f59e0b; }
    .strength-strong { background-color: #10b981; }

    .strength-text {
      font-size: 0.7rem;
      font-weight: 600;
      color: #6b7280;
    }

    .field-error {
      font-size: 0.75rem;
      color: #dc2626;
      margin-top: 0.2rem;
    }

    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.775rem; color: #4b5563; cursor: pointer; }
    :host-context([data-theme="dark"]) .checkbox-label { color: #94a3b8; }
    .checkbox-label a { color: #2563eb; text-decoration: none; }

    .submit-btn {
      height: 46px;
      font-size: 0.95rem;
      font-weight: 600;
      margin-top: 0.5rem;
      width: 100%;
      background: #2563eb;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .submit-btn:hover:not(:disabled) { background: #1d4ed8; }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .signup-footer { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #f1f5f9; text-align: center; display: flex; flex-direction: column; gap: 0.5rem; }
    :host-context([data-theme="dark"]) .signup-footer { border-top-color: #334155; }
    .signin-prompt { font-size: 0.85rem; color: #6b7280; margin: 0; }
    :host-context([data-theme="dark"]) .signin-prompt { color: #94a3b8; }
    .signin-link { color: #2563eb; font-weight: 600; text-decoration: none; }
    .signin-link:hover { text-decoration: underline; }

    .home-back-link a { font-size: 0.8rem; color: #6b7280; text-decoration: none; }
    .home-back-link a:hover { color: #2563eb; text-decoration: underline; }
  `],
})
export class SignUpPageComponent {
  public firstName = '';
  public lastName = '';
  public email = '';
  public password = '';
  public confirmPassword = '';
  public agreeTerms = false;
  public isLoading = signal<boolean>(false);
  public showPassword = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  public strengthPercent = signal<number>(0);
  public strengthClass = signal<string>('strength-weak');
  public strengthLabel = signal<string>('');

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  public togglePasswordVisibility(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.showPassword.update((v) => !v);
  }

  public onPasswordInput(): void {
    const val = this.password;
    if (!val) {
      this.strengthPercent.set(0);
      this.strengthLabel.set('');
      return;
    }

    let score = 0;
    if (val.length >= 8) score += 33;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score += 33;
    if (/[^A-Za-z0-9]/.test(val)) score += 34;

    this.strengthPercent.set(score);

    if (score <= 33) {
      this.strengthClass.set('strength-weak');
      this.strengthLabel.set('Weak');
    } else if (score <= 66) {
      this.strengthClass.set('strength-medium');
      this.strengthLabel.set('Medium');
    } else {
      this.strengthClass.set('strength-strong');
      this.strengthLabel.set('Strong');
    }
  }

  public isFormValid(): boolean {
    return (
      !!this.firstName &&
      !!this.lastName &&
      !!this.email &&
      this.email.includes('@') &&
      this.password.length >= 8 &&
      this.password === this.confirmPassword &&
      this.agreeTerms
    );
  }

  public onSocialSignUp(provider: string): void {
    this.errorMessage.set(`${provider} OAuth Registration requires Enterprise Single Sign-On configuration.`);
  }

  public onSignUp(event: Event): void {
    event.preventDefault();
    if (!this.isFormValid()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const fullName = `${this.firstName.trim()} ${this.lastName.trim()}`;

    this.authService.signup(fullName, this.email, this.password).subscribe({
      next: () => {
        // Automatically login the newly registered user
        this.authService.login(this.email, this.password).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.isLoading.set(false);
            this.router.navigate(['/login']);
          },
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Registration failed. User with this email may already exist.');
      },
    });
  }
}
