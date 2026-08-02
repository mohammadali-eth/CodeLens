import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cdl-features-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-wrapper">
      <section class="page-hero">
        <span class="sub-tag">DEEP FEATURE ENGINE</span>
        <h1 class="page-title">Everything Needed for Enterprise Code Quality</h1>
        <p class="page-lead">
          Explore the tools and AI engines that power automated pull request reviews, vulnerability scanning, and team engineering analytics.
        </p>
      </section>

      <!-- Feature Detail 1 -->
      <section class="feat-row">
        <div class="feat-info">
          <span class="feat-chip">AUTOMATED CODE REVIEW</span>
          <h2>Sub-Second Line-by-Line AI Analysis</h2>
          <p>
            CodeLens scans every pull request commit, generating contextual inline suggestions for edge cases, performance leaks, and syntax modernizations.
          </p>
          <ul class="bullet-list">
            <li>✓ Multi-language support (TypeScript, Python, Go, Java, Rust, C#)</li>
            <li>✓ AST-aware diff parsing</li>
            <li>✓ Automated unit test generation proposals</li>
          </ul>
        </div>
        <div class="feat-box">
          <div class="code-box">
            <code>// AI Suggestion: Refactor for performance</code><br/>
            <code><span class="c-blue">const</span> data = await Promise.all(items.map(fetchItem));</code>
          </div>
        </div>
      </section>

      <!-- Feature Detail 2 -->
      <section class="feat-row reverse">
        <div class="feat-info">
          <span class="feat-chip">SECURITY & CVE SCANNING</span>
          <h2>Real-time Vulnerability Prevention</h2>
          <p>
            Catch security threats before code reaches production. Scans for hardcoded secrets, SQL injection, XSS, insecure dependencies, and OWASP vulnerabilities.
          </p>
          <ul class="bullet-list">
            <li>✓ Zero false-positive tuned heuristics</li>
            <li>✓ Secret & API key entropy detector</li>
            <li>✓ Continuous CVE database sync</li>
          </ul>
        </div>
        <div class="feat-box">
          <div class="sec-box">
            <span class="sec-title">🛡️ CVE-2024-21626 Audit Status</span>
            <p class="sec-pass">PASSED • 0 Vulnerabilities Detected</p>
          </div>
        </div>
      </section>

      <!-- Feature Detail 3 -->
      <section class="feat-row">
        <div class="feat-info">
          <span class="feat-chip">CUSTOM GOVERNANCE</span>
          <h2>Enforce Team Architecture Policies</h2>
          <p>
            Standardize coding patterns across your organization. Define custom rules in plain text to ensure legacy standards are respected.
          </p>
        </div>
        <div class="feat-box">
          <div class="gov-box">
            <code>rule "No Direct SQL" &#123;</code><br/>
            <code>  pattern: "db.query(*)"</code><br/>
            <code>  action: "require ORM repository pattern"</code><br/>
            <code>&#125;</code>
          </div>
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
    .page-lead { font-size: 1.15rem; color: #4b5563; line-height: 1.6; }
    :host-context([data-theme="dark"]) .page-lead { color: #94a3b8; }

    .feat-row { max-width: 1280px; margin: 0 auto; padding: 4rem 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
    @media (max-width: 900px) { .feat-row { grid-template-columns: 1fr; gap: 2rem; } }
    .feat-row.reverse { direction: rtl; }
    .feat-row.reverse .feat-info { direction: ltr; }
    .feat-row.reverse .feat-box { direction: ltr; }

    .feat-chip { font-size: 0.75rem; font-weight: 800; color: #2563eb; background: #eff6ff; border: 1px solid #dbeafe; padding: 0.2rem 0.5rem; border-radius: 6px; }
    .feat-info h2 { font-size: 2rem; font-weight: 800; color: #111827; margin: 0.75rem 0 1rem; }
    :host-context([data-theme="dark"]) .feat-info h2 { color: #ffffff; }
    .feat-info p { font-size: 1rem; color: #4b5563; line-height: 1.6; }
    :host-context([data-theme="dark"]) .feat-info p { color: #94a3b8; }

    .bullet-list { list-style: none; padding: 0; margin: 1.5rem 0 0; display: flex; flex-direction: column; gap: 0.6rem; font-weight: 500; color: #374151; }
    :host-context([data-theme="dark"]) .bullet-list { color: #cbd5e1; }

    .feat-box { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; padding: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    :host-context([data-theme="dark"]) .feat-box { background: #1e293b; border-color: #334155; }

    .code-box, .gov-box { font-family: 'Fira Code', monospace; font-size: 0.85rem; color: #111827; }
    :host-context([data-theme="dark"]) .code-box, :host-context([data-theme="dark"]) .gov-box { color: #f8fafc; }
    .c-blue { color: #2563eb; }

    .sec-box { text-align: center; }
    .sec-title { font-weight: 700; font-size: 1.1rem; color: #111827; display: block; margin-bottom: 0.5rem; }
    :host-context([data-theme="dark"]) .sec-title { color: #ffffff; }
    .sec-pass { color: #047857; font-weight: 700; background: #ecfdf5; padding: 0.5rem 1rem; border-radius: 8px; display: inline-block; }
  `],
})
export class FeaturesPageComponent {}
