import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cdl-security-scan-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="security-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Enterprise Security & Compliance Scan</h1>
          <p class="page-subtitle">OWASP Top 10 auditing, dependency vulnerability scanning, and secret detection</p>
        </div>
        <button class="btn btn-primary" (click)="runScan()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Run Security Audit
        </button>
      </div>

      <div class="status-banner">
        <div class="shield-box">🛡️</div>
        <div class="banner-text">
          <span class="banner-title">Zero Critical Vulnerabilities Detected</span>
          <span class="banner-sub">Last scan performed 2 hours ago across 32,400 lines of code. OWASP Top 10 Compliant.</span>
        </div>
        <span class="badge badge-success">COMPLIANT</span>
      </div>

      <div class="card-panel vulnerability-panel">
        <h2 class="panel-title">Audit Findings</h2>
        <div class="vuln-list">
          <div class="vuln-card low">
            <div class="vuln-left">
              <span class="sev-badge low">LOW</span>
              <div class="vuln-info">
                <span class="vuln-name">Permissive CORS Header in Non-Prod Endpoint</span>
                <span class="vuln-file"><code>apps/backend/src/app.module.ts:24</code></span>
              </div>
            </div>
            <button class="btn btn-sm btn-secondary">Review Code</button>
          </div>

          <div class="vuln-card medium">
            <div class="vuln-left">
              <span class="sev-badge medium">MEDIUM</span>
              <div class="vuln-info">
                <span class="vuln-name">Outdated Dependency: rxjs 7.5.0 (Security Patch Available)</span>
                <span class="vuln-file"><code>apps/frontend/package.json</code></span>
              </div>
            </div>
            <button class="btn btn-sm btn-secondary">Upgrade Dep</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .security-page {
      padding: 1.75rem;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header { display: flex; align-items: center; justify-content: space-between; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0 0 0.25rem; }
    .page-subtitle { font-size: 0.875rem; color: #6b7280; margin: 0; }

    .status-banner {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .shield-box { font-size: 2rem; }
    .banner-text { display: flex; flex-direction: column; flex: 1; }
    .banner-title { font-weight: 700; color: #065f46; font-size: 1.05rem; }
    .banner-sub { font-size: 0.8rem; color: #047857; margin-top: 0.15rem; }

    .vulnerability-panel { display: flex; flex-direction: column; gap: 1rem; }
    .panel-title { font-size: 1.1rem; font-weight: 600; color: #111827; margin: 0; }

    .vuln-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .vuln-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      background: #ffffff;
    }

    .vuln-left { display: flex; align-items: center; gap: 1rem; }
    .sev-badge {
      font-size: 0.65rem;
      font-weight: 800;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      letter-spacing: 0.05em;
    }
    .sev-badge.low { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .sev-badge.medium { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }

    .vuln-info { display: flex; flex-direction: column; }
    .vuln-name { font-weight: 600; color: #111827; font-size: 0.875rem; }
    .vuln-file { font-size: 0.75rem; color: #6b7280; margin-top: 0.2rem; }
  `],
})
export class SecurityScanPageComponent {
  public runScan(): void {
    alert('Security Audit Started!');
  }
}
