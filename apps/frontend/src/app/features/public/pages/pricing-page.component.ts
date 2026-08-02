import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cdl-pricing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-wrapper">
      <section class="page-hero">
        <span class="sub-tag">TRANSPARENT ENTERPRISE PRICING</span>
        <h1 class="page-title">Predictable Pricing for Teams of Any Size</h1>
        <p class="page-lead">Start with a 14-day free trial. Upgrade or downgrade anytime with zero lock-in.</p>

        <!-- Billing Cycle Toggle -->
        <div class="billing-toggle-container">
          <span [class.active]="!isAnnual()" (click)="setAnnual(false)">Monthly Billing</span>
          <button class="toggle-switch" (click)="toggleAnnual()" [attr.aria-label]="'Toggle annual billing'">
            <span class="toggle-knob" [class.knob-right]="isAnnual()"></span>
          </button>
          <span [class.active]="isAnnual()" (click)="setAnnual(true)" class="annual-label">
            Annual Billing <span class="discount-badge">Save 20%</span>
          </span>
        </div>
      </section>

      <!-- Pricing Tier Cards -->
      <section class="pricing-grid-section">
        <div class="pricing-grid">
          <!-- Developer Free -->
          <div class="tier-card">
            <div class="tier-header">
              <h3>Developer</h3>
              <p class="tier-desc">For open-source maintainers and individual developers.</p>
              <div class="price-box">
                <span class="price-val">$0</span>
                <span class="price-period">/ forever</span>
              </div>
            </div>
            <a routerLink="/signup" class="btn-tier btn-secondary">Get Started Free</a>
            <ul class="feature-list">
              <li>✓ 5 Repositories included</li>
              <li>✓ 100 AI PR Reviews / month</li>
              <li>✓ Basic Security & Secret Scan</li>
              <li>✓ Community Discord Support</li>
              <li>✓ Standard Response Time</li>
            </ul>
          </div>

          <!-- Team Pro (Featured) -->
          <div class="tier-card featured">
            <div class="featured-badge">MOST POPULAR</div>
            <div class="tier-header">
              <h3>Team Pro</h3>
              <p class="tier-desc">For fast-growing engineering teams & startups.</p>
              <div class="price-box">
                <span class="price-val">{{ isAnnual() ? '$24' : '$29' }}</span>
                <span class="price-period">/ dev / month</span>
              </div>
            </div>
            <a routerLink="/signup" class="btn-tier btn-primary">Start 14-Day Free Trial</a>
            <ul class="feature-list">
              <li>✓ Unlimited Repositories</li>
              <li>✓ Unlimited AI PR Reviews</li>
              <li>✓ Deep OWASP CVE Vulnerability Audit</li>
              <li>✓ Custom Linter & Policy Rules</li>
              <li>✓ GitHub, GitLab, Slack Integrations</li>
              <li>✓ Priority Email & Chat Support</li>
            </ul>
          </div>

          <!-- Enterprise Custom -->
          <div class="tier-card">
            <div class="tier-header">
              <h3>Enterprise</h3>
              <p class="tier-desc">For large organizations requiring strict security & SSO.</p>
              <div class="price-box">
                <span class="price-val">Custom</span>
              </div>
            </div>
            <a routerLink="/contact" class="btn-tier btn-secondary">Contact Enterprise Sales</a>
            <ul class="feature-list">
              <li>✓ Dedicated Single-Tenant AI Engine</li>
              <li>✓ SAML SSO & Okta Integration</li>
              <li>✓ Custom On-Premise / VPC Deployment</li>
              <li>✓ 99.99% SLA Guarantee</li>
              <li>✓ 24/7 Dedicated Support & TAM</li>
              <li>✓ Audit Logging & SOC2 Reports</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Feature Comparison Matrix -->
      <section class="matrix-section">
        <div class="matrix-header">
          <h2>Detailed Feature Comparison</h2>
        </div>

        <div class="table-container">
          <table class="matrix-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Developer</th>
                <th>Team Pro</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="feat-name">AI Pull Request Audits</td>
                <td>100 / mo</td>
                <td>Unlimited</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td class="feat-name">Security & Secret Scanning</td>
                <td>Basic</td>
                <td>Advanced CVE</td>
                <td>Real-time Threat Intel</td>
              </tr>
              <tr>
                <td class="feat-name">Zero Data Retention Policy</td>
                <td>✓</td>
                <td>✓</td>
                <td>✓ (Dedicated VPC)</td>
              </tr>
              <tr>
                <td class="feat-name">Custom Policy Rules</td>
                <td>−</td>
                <td>✓</td>
                <td>✓ Unlimited</td>
              </tr>
              <tr>
                <td class="feat-name">SAML SSO / SCIM</td>
                <td>−</td>
                <td>−</td>
                <td>✓</td>
              </tr>
              <tr>
                <td class="feat-name">Dedicated Support SLA</td>
                <td>Community</td>
                <td>24 hrs</td>
                <td>1 hr SLA (24/7)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-wrapper { width: 100%; background: #f8fafc; font-family: 'Inter', sans-serif; }
    :host-context([data-theme="dark"]) .page-wrapper { background: #0f172a; }

    .page-hero { max-width: 800px; margin: 0 auto; padding: 5rem 1.5rem 3rem; text-align: center; }
    .sub-tag { font-size: 0.75rem; font-weight: 800; color: #2563eb; letter-spacing: 0.1em; }
    .page-title { font-size: 3rem; font-weight: 800; color: #111827; margin: 0.5rem 0 1.25rem; letter-spacing: -0.025em; }
    :host-context([data-theme="dark"]) .page-title { color: #ffffff; }
    .page-lead { font-size: 1.15rem; color: #4b5563; line-height: 1.6; margin-bottom: 2.5rem; }
    :host-context([data-theme="dark"]) .page-lead { color: #94a3b8; }

    .billing-toggle-container {
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #6b7280;
      cursor: pointer;
    }
    :host-context([data-theme="dark"]) .billing-toggle-container { background: #1e293b; border-color: #334155; color: #94a3b8; }
    .billing-toggle-container span.active { color: #2563eb; }
    .annual-label { display: flex; align-items: center; gap: 0.5rem; }
    .discount-badge { font-size: 0.7rem; font-weight: 800; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 0.15rem 0.45rem; border-radius: 6px; }

    .toggle-switch { width: 44px; height: 24px; border-radius: 9999px; background: #2563eb; border: none; position: relative; cursor: pointer; }
    .toggle-knob { width: 18px; height: 18px; border-radius: 50%; background: #ffffff; position: absolute; top: 3px; left: 3px; transition: transform 0.2s ease; }
    .knob-right { transform: translateX(20px); }

    .pricing-grid-section { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem 5rem; }
    .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; }

    .tier-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      padding: 2.5rem;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    :host-context([data-theme="dark"]) .tier-card { background: #1e293b; border-color: #334155; }
    .tier-card.featured {
      border: 2px solid #2563eb;
      box-shadow: 0 12px 30px -10px rgba(37, 99, 235, 0.25);
    }
    .featured-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: #2563eb;
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 800;
      padding: 0.25rem 0.85rem;
      border-radius: 9999px;
      letter-spacing: 0.05em;
    }

    .tier-header h3 { font-size: 1.5rem; font-weight: 800; color: #111827; margin: 0 0 0.5rem; }
    :host-context([data-theme="dark"]) .tier-header h3 { color: #ffffff; }
    .tier-desc { font-size: 0.875rem; color: #6b7280; margin: 0 0 1.5rem; min-height: 42px; }
    :host-context([data-theme="dark"]) .tier-desc { color: #94a3b8; }

    .price-box { margin-bottom: 1.75rem; }
    .price-val { font-size: 3rem; font-weight: 900; color: #111827; letter-spacing: -0.03em; }
    :host-context([data-theme="dark"]) .price-val { color: #ffffff; }
    .price-period { font-size: 0.9rem; color: #6b7280; font-weight: 500; }

    .btn-tier {
      display: block;
      text-align: center;
      padding: 0.85rem;
      border-radius: 12px;
      font-weight: 700;
      text-decoration: none;
      margin-bottom: 2rem;
    }
    .btn-primary { background: #2563eb; color: #ffffff; }
    .btn-secondary { background: #f8fafc; border: 1px solid #d1d5db; color: #374151; }
    :host-context([data-theme="dark"]) .btn-secondary { background: #0f172a; border-color: #334155; color: #cbd5e1; }

    .feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.85rem; }
    .feature-list li { font-size: 0.875rem; color: #4b5563; font-weight: 500; }
    :host-context([data-theme="dark"]) .feature-list li { color: #cbd5e1; }

    .matrix-section { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem 6rem; }
    .matrix-header { text-align: center; margin-bottom: 2.5rem; }
    .matrix-header h2 { font-size: 2rem; font-weight: 800; color: #111827; }
    :host-context([data-theme="dark"]) .matrix-header h2 { color: #ffffff; }

    .table-container { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; }
    :host-context([data-theme="dark"]) .table-container { background: #1e293b; border-color: #334155; }

    .matrix-table { width: 100%; border-collapse: collapse; text-align: left; }
    .matrix-table th, .matrix-table td { padding: 1.125rem 1.5rem; border-bottom: 1px solid #e5e7eb; font-size: 0.9rem; }
    :host-context([data-theme="dark"]) .matrix-table th, :host-context([data-theme="dark"]) .matrix-table td { border-bottom-color: #334155; }
    .matrix-table th { background: #f8fafc; font-weight: 700; color: #111827; }
    :host-context([data-theme="dark"]) .matrix-table th { background: #0f172a; color: #ffffff; }
    .feat-name { font-weight: 600; color: #111827; }
    :host-context([data-theme="dark"]) .feat-name { color: #f8fafc; }
  `],
})
export class PricingPageComponent {
  public isAnnual = signal<boolean>(true);

  public toggleAnnual(): void {
    this.isAnnual.update((v) => !v);
  }

  public setAnnual(val: boolean): void {
    this.isAnnual.set(val);
  }
}
