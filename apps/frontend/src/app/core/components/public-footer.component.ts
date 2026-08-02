import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cdl-public-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="public-footer">
      <div class="footer-container">
        <!-- Top Row: Brand Info & Grid -->
        <div class="footer-grid">
          <!-- Column 1: Brand Info -->
          <div class="footer-brand-col">
            <div class="footer-logo">
              <div class="logo-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2563EB" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="#4F46E5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#0891B2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="brand-title">CodeLens</span>
            </div>
            <p class="brand-description">
              Autonomous AI-Powered Code Review & Enterprise Vulnerability Intelligence Platform built for high-velocity engineering teams.
            </p>

            <div class="security-pills">
              <span class="sec-pill">🔒 SOC2 Type II Certified</span>
              <span class="sec-pill">⚡ 256-bit AES</span>
              <span class="sec-pill">🛡️ ISO 27001</span>
            </div>
          </div>

          <!-- Column 2: Product -->
          <div class="footer-col">
            <h4 class="col-title">Product</h4>
            <ul class="col-links">
              <li><a routerLink="/features">AI Code Review</a></li>
              <li><a routerLink="/features">Security Scan</a></li>
              <li><a routerLink="/features">Pull Request Automation</a></li>
              <li><a routerLink="/features">Custom Governance</a></li>
              <li><a routerLink="/pricing">Pricing Plans</a></li>
            </ul>
          </div>

          <!-- Column 3: Solutions & Tech -->
          <div class="footer-col">
            <h4 class="col-title">Solutions</h4>
            <ul class="col-links">
              <li><a routerLink="/about">Enterprise DevSecOps</a></li>
              <li><a routerLink="/features">GitHub & GitLab Integration</a></li>
              <li><a routerLink="/features">Vulnerability Audit</a></li>
              <li><a routerLink="/security">Zero Data Retention</a></li>
              <li><a routerLink="/contact">Request Demo</a></li>
            </ul>
          </div>

          <!-- Column 4: Company -->
          <div class="footer-col">
            <h4 class="col-title">Company</h4>
            <ul class="col-links">
              <li><a routerLink="/about">About Us</a></li>
              <li><a routerLink="/contact">Contact Support</a></li>
              <li><a routerLink="/security">Security Portal</a></li>
              <li><a routerLink="/privacy">Privacy Policy</a></li>
              <li><a routerLink="/terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar: Copyright & Social Links -->
        <div class="footer-bottom">
          <div class="copyright">
            © {{ currentYear }} CodeLens Inc. All rights reserved. Built with precision for enterprise engineering.
          </div>

          <div class="footer-legal">
            <a routerLink="/privacy">Privacy</a>
            <span class="dot">•</span>
            <a routerLink="/terms">Terms</a>
            <span class="dot">•</span>
            <a routerLink="/security">Security</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .public-footer {
      background: #ffffff;
      border-top: 1px solid #e5e7eb;
      padding: 4.5rem 0 2.5rem;
      font-family: 'Inter', -apple-system, sans-serif;
    }

    :host-context([data-theme="dark"]) .public-footer {
      background: #0b0f19;
      border-top-color: #1e293b;
    }

    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2.2fr 1fr 1fr 1fr;
      gap: 3rem;
      margin-bottom: 3.5rem;
    }

    @media (max-width: 960px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
      .footer-brand-col {
        grid-column: span 2;
      }
    }

    @media (max-width: 600px) {
      .footer-grid {
        grid-template-columns: 1fr;
      }
      .footer-brand-col {
        grid-column: span 1;
      }
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      margin-bottom: 1rem;
    }

    .logo-box {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: #111827;
    }

    :host-context([data-theme="dark"]) .brand-title {
      color: #f8fafc;
    }

    .brand-description {
      font-size: 0.875rem;
      color: #6b7280;
      line-height: 1.6;
      max-width: 380px;
      margin-bottom: 1.25rem;
    }

    :host-context([data-theme="dark"]) .brand-description {
      color: #94a3b8;
    }

    .security-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .sec-pill {
      font-size: 0.725rem;
      font-weight: 600;
      color: #4b5563;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
    }

    :host-context([data-theme="dark"]) .sec-pill {
      color: #cbd5e1;
      background: #1e293b;
      border-color: #334155;
    }

    .col-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 1.125rem;
    }

    :host-context([data-theme="dark"]) .col-title {
      color: #f8fafc;
    }

    .col-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .col-links a {
      font-size: 0.875rem;
      color: #6b7280;
      text-decoration: none;
      transition: color 0.15s ease;
    }

    :host-context([data-theme="dark"]) .col-links a {
      color: #94a3b8;
    }

    .col-links a:hover {
      color: #2563eb;
    }

    :host-context([data-theme="dark"]) .col-links a:hover {
      color: #60a5fa;
    }

    .footer-bottom {
      padding-top: 2rem;
      border-top: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }

    :host-context([data-theme="dark"]) .footer-bottom {
      border-top-color: #1e293b;
    }

    .copyright {
      font-size: 0.825rem;
      color: #9ca3af;
    }

    .footer-legal {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.825rem;
    }

    .footer-legal a {
      color: #6b7280;
      text-decoration: none;
    }

    .footer-legal a:hover {
      color: #2563eb;
    }

    .dot {
      color: #cbd5e1;
    }
  `],
})
export class PublicFooterComponent {
  public currentYear = new Date().getFullYear();
}
