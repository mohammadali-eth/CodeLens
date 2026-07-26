import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'cdl-forgot-password-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="forgot-container">
      <div class="ambient-glow glow-top"></div>

      <div class="forgot-card-wrapper animate-fade-in">
        <div class="forgot-header">
          <div class="icon-box">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 class="auth-title">Forgot Password?</h1>
          <p class="auth-subtitle">Enter your registered work email and we'll send you reset instructions.</p>
        </div>

        <div *ngIf="submitted()" class="success-banner animate-fade-in">
          <div class="check-icon">✓</div>
          <div class="success-text">
            <strong>Reset link sent!</strong>
            <p>We've sent a password recovery link to <code>{{ email }}</code>.</p>
          </div>
        </div>

        <form *ngIf="!submitted()" (submit)="onSubmit($event)" class="forgot-form">
          <div class="form-group">
            <label for="email" class="form-label">Work Email Address</label>
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

          <button type="submit" class="btn btn-primary submit-btn" [disabled]="isLoading()">
            <span *ngIf="!isLoading()">Send Reset Instructions</span>
            <span *ngIf="isLoading()">Sending email...</span>
          </button>
        </form>

        <div class="forgot-footer">
          <a routerLink="/login" class="back-link">
            ← Back to Sign In
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forgot-container {
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

    .forgot-card-wrapper {
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

    .forgot-header {
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

    .forgot-form { display: flex; flex-direction: column; gap: 1.125rem; }
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

    .forgot-footer { margin-top: 1.5rem; text-align: center; }
    .back-link { font-size: 0.85rem; color: #2563eb; font-weight: 600; text-decoration: none; }
    .back-link:hover { text-decoration: underline; }
  `],
})
export class ForgotPasswordPageComponent {
  public email = 'm.ali@codelens.io';
  public isLoading = signal<boolean>(false);
  public submitted = signal<boolean>(false);

  public onSubmit(event: Event): void {
    event.preventDefault();
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.submitted.set(true);
    }, 600);
  }
}
