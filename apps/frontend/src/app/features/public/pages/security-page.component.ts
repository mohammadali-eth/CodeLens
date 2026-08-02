import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cdl-security-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-wrapper">
      <section class="page-hero">
        <span class="sub-tag">SECURITY & GOVERNANCE</span>
        <h1 class="page-title">Enterprise Security at Our Core</h1>
        <p class="page-lead">
          CodeLens is designed to satisfy the world's strictest security, compliance, and privacy benchmarks. Your source code remains your exclusive property.
        </p>
      </section>

      <section class="sec-grid-section">
        <div class="sec-grid">
          <div class="sec-card">
            <div class="sec-icon">🔒</div>
            <h3>SOC2 Type II & ISO 27001</h3>
            <p>Independently audited and certified controls covering security, availability, and processing integrity.</p>
          </div>

          <div class="sec-card">
            <div class="sec-icon">🛡️</div>
            <h3>Zero Data Retention AI</h3>
            <p>Code snippets submitted for analysis are stored in ephemeral memory and discarded immediately upon response completion.</p>
          </div>

          <div class="sec-card">
            <div class="sec-icon">⚡</div>
            <h3>AES-256 & TLS 1.3 Encryption</h3>
            <p>All data in transit is encrypted using TLS 1.3. Data at rest is secured via 256-bit AES encryption standard.</p>
          </div>

          <div class="sec-card">
            <div class="sec-icon">🔑</div>
            <h3>SAML SSO & RBAC</h3>
            <p>Enforce single sign-on via Okta, Azure AD, or Google Workspace with granular Role-Based Access Control.</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-wrapper { width: 100%; background: #f8fafc; font-family: 'Inter', sans-serif; min-height: 100vh; }
    :host-context([data-theme="dark"]) .page-wrapper { background: #0f172a; }

    .page-hero { max-width: 800px; margin: 0 auto; padding: 5rem 1.5rem 3rem; text-align: center; }
    .sub-tag { font-size: 0.75rem; font-weight: 800; color: #2563eb; letter-spacing: 0.1em; }
    .page-title { font-size: 3rem; font-weight: 800; color: #111827; margin: 0.5rem 0 1.25rem; letter-spacing: -0.025em; }
    :host-context([data-theme="dark"]) .page-title { color: #ffffff; }
    .page-lead { font-size: 1.15rem; color: #4b5563; line-height: 1.6; }
    :host-context([data-theme="dark"]) .page-lead { color: #94a3b8; }

    .sec-grid-section { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem 6rem; }
    .sec-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
    .sec-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 2rem; }
    :host-context([data-theme="dark"]) .sec-card { background: #1e293b; border-color: #334155; }
    .sec-icon { font-size: 2rem; margin-bottom: 1rem; }
    .sec-card h3 { font-size: 1.2rem; font-weight: 700; color: #111827; margin: 0 0 0.5rem; }
    :host-context([data-theme="dark"]) .sec-card h3 { color: #ffffff; }
    .sec-card p { font-size: 0.9rem; color: #6b7280; line-height: 1.6; margin: 0; }
  `],
})
export class SecurityPageComponent {}
