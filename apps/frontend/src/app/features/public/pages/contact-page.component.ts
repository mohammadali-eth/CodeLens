import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'cdl-contact-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-wrapper">
      <section class="page-hero">
        <span class="sub-tag">GET IN TOUCH</span>
        <h1 class="page-title">We'd Love to Hear From You</h1>
        <p class="page-lead">
          Have questions about CodeLens Enterprise, custom deployment models, or security compliance? Our technical team is ready to assist.
        </p>
      </section>

      <section class="contact-grid-section">
        <div class="contact-grid">
          <!-- Form -->
          <div class="contact-card">
            <h3 class="card-title">Send Us a Message</h3>

            <div class="success-banner" *ngIf="isSubmitted()">
              ✓ Thank you! Your message has been received. A senior engineer will respond within 2 business hours.
            </div>

            <form (submit)="onSubmit($event)" class="form-flex" *ngIf="!isSubmitted()">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" [(ngModel)]="name" name="name" class="form-input" placeholder="Sarah Jenkins" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Work Email</label>
                  <input type="email" [(ngModel)]="email" name="email" class="form-input" placeholder="sarah@company.com" required />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Company / Organization</label>
                <input type="text" [(ngModel)]="company" name="company" class="form-input" placeholder="Acme Inc." />
              </div>

              <div class="form-group">
                <label class="form-label">Topic</label>
                <select [(ngModel)]="topic" name="topic" class="form-select">
                  <option value="enterprise">Enterprise Sales & Demo</option>
                  <option value="security">Security & Compliance Audit</option>
                  <option value="support">Technical Support</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Message</label>
                <textarea rows="4" [(ngModel)]="message" name="message" class="form-input" placeholder="Tell us how we can help..." required></textarea>
              </div>

              <button type="submit" class="submit-btn" [disabled]="isSubmitting()">
                <span *ngIf="!isSubmitting()">Send Message</span>
                <span *ngIf="isSubmitting()">Sending...</span>
              </button>
            </form>
          </div>

          <!-- Contact Details -->
          <div class="info-column">
            <div class="info-card">
              <h4>Direct Contact</h4>
              <div class="info-item">
                <span class="info-icon">📧</span>
                <div>
                  <strong>Sales & Enterprise</strong>
                  <p>enterprise&#64;codelens.io</p>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">🛡️</span>
                <div>
                  <strong>Security Team</strong>
                  <p>security&#64;codelens.io</p>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">💬</span>
                <div>
                  <strong>Customer Support</strong>
                  <p>support&#64;codelens.io</p>
                </div>
              </div>
            </div>

            <div class="info-card">
              <h4>Global Headquarters</h4>
              <p class="loc-text">
                CodeLens Inc.<br />
                500 Howard Street, Suite 400<br />
                San Francisco, CA 94105, USA
              </p>
            </div>

            <div class="info-card">
              <h4>Social & Community</h4>
              <div class="social-flex">
                <a href="https://github.com" target="_blank" class="social-link">GitHub</a>
                <a href="https://twitter.com" target="_blank" class="social-link">X / Twitter</a>
                <a href="https://linkedin.com" target="_blank" class="social-link">LinkedIn</a>
                <a href="https://discord.com" target="_blank" class="social-link">Discord</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-wrapper { width: 100%; background: #f8fafc; font-family: 'Inter', sans-serif; min-height: 100vh; }
    :host-context([data-theme="dark"]) .page-wrapper { background: #0f172a; }

    .page-hero { max-width: 800px; margin: 0 auto; padding: 5rem 1.5rem 2.5rem; text-align: center; }
    .sub-tag { font-size: 0.75rem; font-weight: 800; color: #2563eb; letter-spacing: 0.1em; }
    .page-title { font-size: 3rem; font-weight: 800; color: #111827; margin: 0.5rem 0 1.25rem; letter-spacing: -0.025em; }
    :host-context([data-theme="dark"]) .page-title { color: #ffffff; }
    .page-lead { font-size: 1.15rem; color: #4b5563; line-height: 1.6; }
    :host-context([data-theme="dark"]) .page-lead { color: #94a3b8; }

    .contact-grid-section { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem 6rem; }
    .contact-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 2.5rem; }
    @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; } }

    .contact-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; padding: 2.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
    :host-context([data-theme="dark"]) .contact-card { background: #1e293b; border-color: #334155; }
    .card-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0 0 1.5rem; }
    :host-context([data-theme="dark"]) .card-title { color: #ffffff; }

    .form-flex { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }

    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-label { font-size: 0.825rem; font-weight: 600; color: #374151; }
    :host-context([data-theme="dark"]) .form-label { color: #cbd5e1; }

    .form-input, .form-select {
      padding: 0.75rem 1rem;
      border-radius: 10px;
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: #111827;
      font-size: 0.9rem;
      outline: none;
    }
    :host-context([data-theme="dark"]) .form-input,
    :host-context([data-theme="dark"]) .form-select {
      background: #0f172a;
      border-color: #334155;
      color: #f8fafc;
    }

    .submit-btn {
      background: #2563eb;
      color: #ffffff;
      font-weight: 700;
      font-size: 1rem;
      padding: 0.85rem;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      margin-top: 0.5rem;
      transition: background 0.15s ease;
    }
    .submit-btn:hover { background: #1d4ed8; }

    .success-banner {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #047857;
      padding: 1.25rem;
      border-radius: 12px;
      font-weight: 600;
      line-height: 1.5;
    }

    .info-column { display: flex; flex-direction: column; gap: 1.5rem; }
    .info-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1.75rem; }
    :host-context([data-theme="dark"]) .info-card { background: #1e293b; border-color: #334155; }
    .info-card h4 { font-size: 1.1rem; font-weight: 700; color: #111827; margin: 0 0 1rem; }
    :host-context([data-theme="dark"]) .info-card h4 { color: #ffffff; }

    .info-item { display: flex; gap: 0.85rem; margin-bottom: 1rem; }
    .info-icon { font-size: 1.25rem; }
    .info-item strong { font-size: 0.85rem; color: #111827; display: block; }
    :host-context([data-theme="dark"]) .info-item strong { color: #ffffff; }
    .info-item p { font-size: 0.85rem; color: #6b7280; margin: 0; }

    .loc-text { font-size: 0.875rem; color: #4b5563; line-height: 1.6; margin: 0; }
    :host-context([data-theme="dark"]) .loc-text { color: #94a3b8; }

    .social-flex { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .social-link {
      font-size: 0.8rem;
      font-weight: 600;
      color: #2563eb;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      padding: 0.4rem 0.85rem;
      border-radius: 8px;
      text-decoration: none;
    }
  `],
})
export class ContactPageComponent {
  public name = '';
  public email = '';
  public company = '';
  public topic = 'enterprise';
  public message = '';
  public isSubmitting = signal<boolean>(false);
  public isSubmitted = signal<boolean>(false);

  public onSubmit(event: Event): void {
    event.preventDefault();
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);
    }, 600);
  }
}
