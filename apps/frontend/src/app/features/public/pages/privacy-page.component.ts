import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cdl-privacy-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="legal-wrapper">
      <div class="legal-container">
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last Updated: August 2, 2026</p>

        <section class="legal-body">
          <h3>1. Information We Collect</h3>
          <p>We collect information necessary to provide CodeLens AI Code Review services, including email address, user profile metadata, and OAuth tokens for repository access.</p>

          <h3>2. Source Code Privacy & AI Training Policy</h3>
          <p>CodeLens strictly operates under a <strong>Zero Retention Policy</strong>. Code fragments transmitted for analysis are processed in RAM and discarded immediately. Your source code is never used to train public or shared AI models.</p>

          <h3>3. Data Protection & Compliance</h3>
          <p>We implement technical and organizational measures (AES-256 encryption, TLS 1.3, SOC2 Type II compliance) to safeguard your information against unauthorized access.</p>

          <h3>4. Contact Us</h3>
          <p>For privacy inquiries or data subject rights requests, please contact privacy&#64;codelens.io.</p>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .legal-wrapper { background: #f8fafc; padding: 4rem 1.5rem; min-height: 100vh; font-family: 'Inter', sans-serif; }
    :host-context([data-theme="dark"]) .legal-wrapper { background: #0f172a; }
    .legal-container { max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 3rem; }
    :host-context([data-theme="dark"]) .legal-container { background: #1e293b; border-color: #334155; }
    h1 { font-size: 2.25rem; font-weight: 800; color: #111827; margin: 0 0 0.5rem; }
    :host-context([data-theme="dark"]) h1 { color: #ffffff; }
    .last-updated { font-size: 0.85rem; color: #6b7280; margin-bottom: 2rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; }
    .legal-body h3 { font-size: 1.15rem; font-weight: 700; color: #111827; margin: 1.5rem 0 0.5rem; }
    :host-context([data-theme="dark"]) .legal-body h3 { color: #ffffff; }
    .legal-body p { font-size: 0.95rem; color: #4b5563; line-height: 1.6; margin: 0 0 1rem; }
    :host-context([data-theme="dark"]) .legal-body p { color: #cbd5e1; }
  `],
})
export class PrivacyPageComponent {}
