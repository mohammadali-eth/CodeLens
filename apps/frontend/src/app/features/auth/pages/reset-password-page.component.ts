import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'cdl-reset-password-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="reset-container">
      <div class="ambient-glow glow-top"></div>

      <div class="reset-card-wrapper animate-fade-in">
        <div class="reset-header">
          <div class="icon-box">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
          </div>
          <h1 class="auth-title">Set New Password</h1>
          <p class="auth-subtitle">Must be at least 8 characters and include a special character.</p>
        </div>

        <div *ngIf="isSuccess()" class="success-banner animate-fade-in">
          <div class="check-icon">✓</div>
          <div class="success-text">
            <strong>Password updated successfully!</strong>
            <p>Redirecting you to the sign in page...</p>
          </div>
        </div>

        <form *ngIf="!isSuccess()" (submit)="onReset($event)" class="reset-form">
          <div class="form-group">
            <label for="newPassword" class="form-label">New Password</label>
            <input
              id="newPassword"
              type="password"
              class="form-input"
              placeholder="••••••••••••"
              [(ngModel)]="newPassword"
              name="newPassword"
              required
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              class="form-input"
              placeholder="••••••••••••"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary submit-btn" [disabled]="isLoading()">
            <span *ngIf="!isLoading()">Update Password</span>
            <span *ngIf="isLoading()">Updating...</span>
          </button>
        </form>

        <div class="reset-footer">
          <a routerLink="/login" class="back-link">← Back to Sign In</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reset-container {
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

    .ambient-glow {
      position: absolute;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, #2563eb 0%, rgba(37, 99, 235, 0) 70%);
      top: -100px;
      right: -100px;
      filter: blur(90px);
      opacity: 0.3;
    }

    .reset-card-wrapper {
      width: 100%;
      max-width: 420px;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 2.25rem;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
      position: relative;
      z-index: 10;
    }

    .reset-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .icon-box {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .auth-title { font-size: 1.4rem; font-weight: 700; color: #111827; margin: 0 0 0.35rem; }
    .auth-subtitle { font-size: 0.85rem; color: #6b7280; margin: 0; line-height: 1.4; }

    .reset-form { display: flex; flex-direction: column; gap: 1.125rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-label { font-size: 0.825rem; font-weight: 600; color: #374151; }

    .submit-btn { height: 46px; font-size: 0.95rem; font-weight: 600; margin-top: 0.5rem; }

    .success-banner {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 10px;
      padding: 1rem;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .check-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #10b981;
      color: #ffffff;
      font-weight: 800;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .success-text { font-size: 0.8rem; color: #065f46; }
    .success-text p { margin: 0.2rem 0 0; }

    .reset-footer { margin-top: 1.5rem; text-align: center; }
    .back-link { font-size: 0.85rem; color: #2563eb; font-weight: 600; text-decoration: none; }
    .back-link:hover { text-decoration: underline; }
  `],
})
export class ResetPasswordPageComponent {
  public newPassword = '';
  public confirmPassword = '';
  public isLoading = signal<boolean>(false);
  public isSuccess = signal<boolean>(false);

  constructor(private router: Router) {}

  public onReset(event: Event): void {
    event.preventDefault();
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.isSuccess.set(true);
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    }, 600);
  }
}
