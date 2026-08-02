import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cdl-terms-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="legal-wrapper">
      <div class="legal-container">
        <h1>Terms & Conditions</h1>
        <p class="last-updated">Last Updated: August 2, 2026</p>

        <section class="legal-body">
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing or using CodeLens, you agree to be bound by these Terms & Conditions and all applicable laws and regulations.</p>

          <h3>2. SaaS Platform Use & Licenses</h3>
          <p>CodeLens grants you a non-exclusive, non-transferable right to access and use the platform for software development, code review, and vulnerability analysis within your organization.</p>

          <h3>3. Service Level Agreement (SLA)</h3>
          <p>Enterprise tier customers are covered by a 99.99% monthly uptime SLA. Dedicated support response times are governed by your enterprise subscription agreement.</p>

          <h3>4. Limitation of Liability</h3>
          <p>In no event shall CodeLens be liable for indirect, incidental, or consequential damages arising out of the use or inability to use the platform services.</p>
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
export class TermsPageComponent {}
