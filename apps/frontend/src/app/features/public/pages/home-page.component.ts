import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cdl-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="home-container">
      <!-- Ambient Glow Behind Hero -->
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>

      <!-- ================= HERO SECTION ================= -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="pill-announcement">
            <span class="pill-badge">NEW v2.4</span>
            <span>Autonomous AI Pull Request Reviews & Real-time Security Audits</span>
            <span class="arrow">→</span>
          </div>

          <h1 class="hero-title">
            Ship Clean, Secure Code <br />
            <span class="gradient-text">10x Faster with AI</span>
          </h1>

          <p class="hero-subtitle">
            CodeLens automates code reviews, enforces architectural standards, detects security vulnerabilities before merge, and optimizes engineering velocity across enterprise teams.
          </p>

          <div class="hero-cta-group">
            <a routerLink="/signup" class="cta-primary">
              <span>Start Free 14-Day Trial</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a routerLink="/contact" class="cta-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Schedule Live Demo</span>
            </a>
          </div>

          <div class="hero-trust-badges">
            <span class="badge-item">✓ No Credit Card Required</span>
            <span class="badge-item">✓ 5-Minute GitHub Setup</span>
            <span class="badge-item">✓ SOC2 Type II Certified</span>
          </div>
        </div>

        <!-- Interactive AI Review Simulator Hero Demo Card -->
        <div class="hero-demo-card">
          <div class="card-header-bar">
            <div class="window-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <div class="tab-pill">PR #482 • Security & Performance AI Scan</div>
            <div class="status-live">
              <span class="pulse-dot"></span>
              <span>AI Analyzing...</span>
            </div>
          </div>

          <div class="code-diff-container">
            <div class="code-line deleted">
              <span class="line-num">24</span>
              <span class="sign">-</span>
              <span class="code">const query = 'SELECT * FROM users WHERE email = ' + userEmail;</span>
            </div>
            <div class="code-line added">
              <span class="line-num">24</span>
              <span class="sign">+</span>
              <span class="code">const query = 'SELECT * FROM users WHERE email = $1'; // Parameterized query</span>
            </div>

            <!-- AI Comment Widget -->
            <div class="ai-comment-card">
              <div class="ai-comment-header">
                <div class="ai-avatar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                    <path d="M2 17L12 22L22 17" />
                  </svg>
                </div>
                <span class="ai-name">CodeLens Guard</span>
                <span class="sec-risk-badge">HIGH SECURITY RISK FIXED</span>
              </div>
              <p class="ai-text">
                Prevented potential SQL Injection vulnerability (CWE-89). Updated query to use parameterized bindings and sanitized inputs.
              </p>
              <div class="ai-actions">
                <button class="ai-btn-apply">Auto-Fix Applied ✓</button>
                <span class="ai-time">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= TRUSTED LOGOS SECTION ================= -->
      <section class="logos-section">
        <p class="logos-title">TRUSTED BY ENGINEERING LEADS AT GLOBAL INNOVATORS</p>
        <div class="logos-flex">
          <span class="company-logo">STRIPE</span>
          <span class="company-logo">VERCEL</span>
          <span class="company-logo">LINEAR</span>
          <span class="company-logo">NOTION</span>
          <span class="company-logo">SUPABASE</span>
          <span class="company-logo">CLERK</span>
        </div>
      </section>

      <!-- ================= FEATURES GRID ================= -->
      <section class="section features-section">
        <div class="section-header">
          <span class="section-label">PLATFORM CAPABILITIES</span>
          <h2 class="section-title">Built for Modern Enterprise Codebases</h2>
          <p class="section-subtitle">Comprehensive AI-driven code intelligence that fits directly into your pull request workflow.</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon bg-blue">⚡</div>
            <h3>Automated PR Reviews</h3>
            <p>Get instant inline comments, code quality scores, and refactoring suggestions on every pull request within seconds.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon bg-indigo">🛡️</div>
            <h3>Deep Vulnerability Scanning</h3>
            <p>Scans for OWASP Top 10, CVE vulnerabilities, hardcoded secrets, and unsafe dependencies automatically.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon bg-purple">🎨</div>
            <h3>Custom Rule Enforcement</h3>
            <p>Define custom linter rules, architectural boundaries, and organization-specific coding guidelines in plain text.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon bg-cyan">📊</div>
            <h3>Engineering Analytics</h3>
            <p>Track review velocity, code health metrics, team productivity trends, and recurring technical debt hotspots.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon bg-green">🤖</div>
            <h3>Interactive AI Chat Assistant</h3>
            <p>Ask questions about your codebase, request unit test generation, or explain complex legacy routines inline.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon bg-amber">🔒</div>
            <h3>Enterprise Zero Retention</h3>
            <p>Your code is processed securely with zero data retention. We never use your code to train foundational LLMs.</p>
          </div>
        </div>
      </section>

      <!-- ================= HOW IT WORKS ================= -->
      <section class="section workflow-section">
        <div class="section-header">
          <span class="section-label">HOW CODELENS WORKS</span>
          <h2 class="section-title">Seamless 3-Step Setup</h2>
        </div>

        <div class="workflow-steps">
          <div class="step-card">
            <div class="step-num">01</div>
            <h4>Connect Repositories</h4>
            <p>Install the CodeLens GitHub App or GitLab integration in 2 clicks. OAuth authentication guarantees zero credential exposure.</p>
          </div>

          <div class="step-card">
            <div class="step-num">02</div>
            <h4>Autonomous AI Audit</h4>
            <p>Every pull request triggers multi-model AI analysis verifying syntax, security, performance, and custom policy rules.</p>
          </div>

          <div class="step-card">
            <div class="step-num">03</div>
            <h4>Instant Merge & Ship</h4>
            <p>Automated approvals for clean PRs, actionable recommendations for changes, and 10x faster code review completion.</p>
          </div>
        </div>
      </section>

      <!-- ================= STATISTICS ================= -->
      <section class="section stats-section">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">10x</div>
            <div class="stat-label">Faster Pull Request Cycles</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">99.9%</div>
            <div class="stat-label">Critical CVE Detection Rate</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">15M+</div>
            <div class="stat-label">Lines of Code Analyzed</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">4.9/5</div>
            <div class="stat-label">Enterprise Customer Rating</div>
          </div>
        </div>
      </section>

      <!-- ================= TESTIMONIALS ================= -->
      <section class="section testimonials-section">
        <div class="section-header">
          <span class="section-label">TESTIMONIALS</span>
          <h2 class="section-title">Loved by Engineers & Architects</h2>
        </div>

        <div class="testimonials-grid">
          <div class="testimonial-card">
            <p class="quote">"CodeLens saved our team over 15 hours per developer every week. The security scan caught a critical flaw before our major production release."</p>
            <div class="author-row">
              <div class="avatar">AK</div>
              <div>
                <div class="author-name">Alex Chen</div>
                <div class="author-role">VP of Engineering, CloudScale</div>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <p class="quote">"The custom rule engine allows us to enforce our strict NestJS and Angular guidelines across 40+ microservices automatically."</p>
            <div class="author-row">
              <div class="avatar">SJ</div>
              <div>
                <div class="author-name">Sarah Jenkins</div>
                <div class="author-role">Principal Architect, FinTech Global</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= FAQ SECTION ================= -->
      <section class="section faq-section">
        <div class="section-header">
          <span class="section-label">FREQUENTLY ASKED QUESTIONS</span>
          <h2 class="section-title">Got Questions? We Have Answers</h2>
        </div>

        <div class="faq-accordion">
          <div class="faq-item" *ngFor="let item of faqList(); let i = index" (click)="toggleFaq(i)">
            <div class="faq-question">
              <span>{{ item.q }}</span>
              <span class="faq-icon">{{ activeFaq() === i ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" *ngIf="activeFaq() === i">
              {{ item.a }}
            </div>
          </div>
        </div>
      </section>

      <!-- ================= CTA BANNER ================= -->
      <section class="cta-banner-section">
        <div class="cta-banner-content">
          <h2>Transform Your Code Review Process Today</h2>
          <p>Join thousands of developers shipping cleaner, safer code with CodeLens AI.</p>
          <div class="cta-flex">
            <a routerLink="/signup" class="btn-primary-lg">Start Free Trial Now</a>
            <a routerLink="/pricing" class="btn-secondary-lg">Explore Pricing</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      width: 100%;
      background: #f8fafc;
      position: relative;
      overflow: hidden;
      font-family: 'Inter', -apple-system, sans-serif;
    }

    :host-context([data-theme="dark"]) .home-container {
      background: #0f172a;
    }

    .glow-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.35;
      pointer-events: none;
    }
    .orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, #2563eb, transparent 70%); top: -200px; right: -100px; }
    .orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, #4f46e5, transparent 70%); top: 400px; left: -150px; }

    .hero-section {
      max-width: 1280px;
      margin: 0 auto;
      padding: 5rem 1.5rem 4rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3.5rem;
      align-items: center;
    }

    @media (max-width: 1024px) {
      .hero-section {
        grid-template-columns: 1fr;
        padding-top: 3rem;
      }
    }

    .pill-announcement {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }
    :host-context([data-theme="dark"]) .pill-announcement {
      background: #1e293b;
      border-color: #334155;
      color: #cbd5e1;
    }
    .pill-badge {
      background: #eff6ff;
      color: #2563eb;
      font-weight: 700;
      font-size: 0.7rem;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }

    .hero-title {
      font-size: 3.25rem;
      font-weight: 800;
      line-height: 1.15;
      color: #111827;
      letter-spacing: -0.03em;
      margin: 0 0 1.25rem;
    }
    :host-context([data-theme="dark"]) .hero-title { color: #ffffff; }

    @media (max-width: 640px) {
      .hero-title { font-size: 2.25rem; }
    }

    .gradient-text {
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #0891b2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 1.125rem;
      color: #4b5563;
      line-height: 1.6;
      margin-bottom: 2rem;
      max-width: 540px;
    }
    :host-context([data-theme="dark"]) .hero-subtitle { color: #94a3b8; }

    .hero-cta-group {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .cta-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff;
      font-weight: 600;
      font-size: 1rem;
      padding: 0.85rem 1.75rem;
      border-radius: 12px;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
      transition: all 0.2s ease;
    }
    .cta-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
    }

    .cta-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      background: #ffffff;
      border: 1px solid #d1d5db;
      color: #374151;
      font-weight: 600;
      font-size: 1rem;
      padding: 0.85rem 1.5rem;
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    :host-context([data-theme="dark"]) .cta-secondary {
      background: #1e293b;
      border-color: #334155;
      color: #e2e8f0;
    }
    .cta-secondary:hover {
      background: #f8fafc;
      border-color: #9ca3af;
    }

    .hero-trust-badges {
      display: flex;
      gap: 1.25rem;
      font-size: 0.825rem;
      color: #6b7280;
      font-weight: 500;
      flex-wrap: wrap;
    }

    /* Hero Demo Card */
    .hero-demo-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.12);
      overflow: hidden;
      position: relative;
    }
    :host-context([data-theme="dark"]) .hero-demo-card {
      background: #1e293b;
      border-color: #334155;
    }

    .card-header-bar {
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
      padding: 0.75rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    :host-context([data-theme="dark"]) .card-header-bar {
      background: #0f172a;
      border-bottom-color: #334155;
    }

    .window-dots { display: flex; gap: 0.4rem; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }

    .tab-pill { font-size: 0.75rem; font-weight: 600; color: #4b5563; }
    :host-context([data-theme="dark"]) .tab-pill { color: #94a3b8; }

    .status-live { display: flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; font-weight: 700; color: #2563eb; }
    .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: #2563eb; animation: pulse 1.5s infinite; }

    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

    .code-diff-container {
      padding: 1.25rem;
      font-family: 'Fira Code', monospace;
      font-size: 0.8rem;
    }

    .code-line { display: flex; align-items: center; gap: 0.75rem; padding: 0.35rem 0.5rem; border-radius: 4px; }
    .code-line.deleted { background: #fef2f2; color: #991b1b; }
    .code-line.added { background: #ecfdf5; color: #065f46; margin-bottom: 1rem; }
    :host-context([data-theme="dark"]) .code-line.deleted { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
    :host-context([data-theme="dark"]) .code-line.added { background: rgba(16, 185, 129, 0.15); color: #6ee7b7; }

    .line-num { color: #9ca3af; width: 20px; font-size: 0.7rem; }
    .sign { font-weight: 700; }

    .ai-comment-card {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      padding: 1rem;
      font-family: 'Inter', sans-serif;
    }
    :host-context([data-theme="dark"]) .ai-comment-card {
      background: #1e3a8a;
      border-color: #3b82f6;
    }

    .ai-comment-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .ai-avatar { width: 22px; height: 22px; border-radius: 6px; background: #2563eb; display: flex; align-items: center; justify-content: center; }
    .ai-name { font-size: 0.8rem; font-weight: 700; color: #1e40af; }
    :host-context([data-theme="dark"]) .ai-name { color: #93c5fd; }

    .sec-risk-badge { font-size: 0.65rem; font-weight: 800; background: #dbeafe; color: #1e40af; padding: 0.1rem 0.4rem; border-radius: 4px; margin-left: auto; }

    .ai-text { font-size: 0.825rem; color: #1e3a8a; margin: 0 0 0.75rem; line-height: 1.4; }
    :host-context([data-theme="dark"]) .ai-text { color: #e0f2fe; }

    .ai-actions { display: flex; align-items: center; justify-content: space-between; }
    .ai-btn-apply { background: #2563eb; color: #ffffff; border: none; font-size: 0.725rem; font-weight: 600; padding: 0.3rem 0.7rem; border-radius: 6px; cursor: pointer; }
    .ai-time { font-size: 0.7rem; color: #60a5fa; }

    /* Logos section */
    .logos-section {
      text-align: center;
      padding: 3rem 1.5rem;
      background: #ffffff;
      border-y: 1px solid #e5e7eb;
    }
    :host-context([data-theme="dark"]) .logos-section { background: #0b0f19; }

    .logos-title { font-size: 0.75rem; font-weight: 700; color: #9ca3af; letter-spacing: 0.1em; margin-bottom: 1.5rem; }
    .logos-flex { display: flex; justify-content: center; align-items: center; gap: 3.5rem; flex-wrap: wrap; }
    .company-logo { font-size: 1.25rem; font-weight: 900; color: #64748b; letter-spacing: -0.03em; }

    /* General Section Styling */
    .section { max-width: 1280px; margin: 0 auto; padding: 5rem 1.5rem; }
    .section-header { text-align: center; max-width: 680px; margin: 0 auto 3.5rem; }
    .section-label { font-size: 0.75rem; font-weight: 700; color: #2563eb; letter-spacing: 0.1em; text-transform: uppercase; }
    .section-title { font-size: 2.25rem; font-weight: 800; color: #111827; letter-spacing: -0.02em; margin: 0.5rem 0 1rem; }
    :host-context([data-theme="dark"]) .section-title { color: #ffffff; }
    .section-subtitle { font-size: 1.05rem; color: #6b7280; line-height: 1.5; margin: 0; }
    :host-context([data-theme="dark"]) .section-subtitle { color: #94a3b8; }

    /* Features Grid */
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.75rem; }
    .feature-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 2rem;
      transition: all 0.2s ease;
    }
    :host-context([data-theme="dark"]) .feature-card { background: #1e293b; border-color: #334155; }
    .feature-card:hover { transform: translateY(-3px); box-shadow: 0 12px 24px -6px rgba(0,0,0,0.08); border-color: #bfdbfe; }

    .feature-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 1.25rem; }
    .bg-blue { background: #eff6ff; }
    .bg-indigo { background: #e0e7ff; }
    .bg-purple { background: #f3e8ff; }
    .bg-cyan { background: #e0f2fe; }
    .bg-green { background: #d1fae5; }
    .bg-amber { background: #fef3c7; }

    .feature-card h3 { font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0 0 0.65rem; }
    :host-context([data-theme="dark"]) .feature-card h3 { color: #ffffff; }
    .feature-card p { font-size: 0.875rem; color: #6b7280; line-height: 1.6; margin: 0; }

    /* Workflow Steps */
    .workflow-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
    .step-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 2rem; position: relative; }
    :host-context([data-theme="dark"]) .step-card { background: #1e293b; border-color: #334155; }
    .step-num { font-size: 2rem; font-weight: 900; color: #2563eb; opacity: 0.3; margin-bottom: 0.5rem; }
    .step-card h4 { font-size: 1.1rem; font-weight: 700; color: #111827; margin: 0 0 0.5rem; }
    :host-context([data-theme="dark"]) .step-card h4 { color: #ffffff; }
    .step-card p { font-size: 0.875rem; color: #6b7280; line-height: 1.6; margin: 0; }

    /* Stats */
    .stats-section { background: #ffffff; border-y: 1px solid #e5e7eb; }
    :host-context([data-theme="dark"]) .stats-section { background: #0b0f19; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center; }
    .stat-value { font-size: 3rem; font-weight: 900; color: #2563eb; letter-spacing: -0.03em; }
    .stat-label { font-size: 0.875rem; font-weight: 600; color: #4b5563; margin-top: 0.25rem; }
    :host-context([data-theme="dark"]) .stat-label { color: #94a3b8; }

    /* Testimonials */
    .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem; }
    .testimonial-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 2rem; }
    :host-context([data-theme="dark"]) .testimonial-card { background: #1e293b; border-color: #334155; }
    .quote { font-size: 0.95rem; color: #374151; line-height: 1.6; font-style: italic; margin-bottom: 1.5rem; }
    :host-context([data-theme="dark"]) .quote { color: #cbd5e1; }
    .author-row { display: flex; align-items: center; gap: 0.75rem; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: #2563eb; color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .author-name { font-size: 0.875rem; font-weight: 700; color: #111827; }
    :host-context([data-theme="dark"]) .author-name { color: #ffffff; }
    .author-role { font-size: 0.75rem; color: #6b7280; }

    /* FAQ */
    .faq-accordion { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
    .faq-item { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.25rem; cursor: pointer; transition: border-color 0.15s ease; }
    :host-context([data-theme="dark"]) .faq-item { background: #1e293b; border-color: #334155; }
    .faq-item:hover { border-color: #2563eb; }
    .faq-question { display: flex; justify-content: space-between; align-items: center; font-weight: 700; font-size: 1rem; color: #111827; }
    :host-context([data-theme="dark"]) .faq-question { color: #ffffff; }
    .faq-answer { margin-top: 0.85rem; font-size: 0.875rem; color: #4b5563; line-height: 1.6; border-top: 1px solid #f1f5f9; padding-top: 0.85rem; }
    :host-context([data-theme="dark"]) .faq-answer { color: #94a3b8; border-top-color: #334155; }

    /* CTA Banner */
    .cta-banner-section {
      max-width: 1280px;
      margin: 2rem auto 5rem;
      padding: 0 1.5rem;
    }
    .cta-banner-content {
      background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #4f46e5 100%);
      border-radius: 24px;
      padding: 4rem 2rem;
      text-align: center;
      color: #ffffff;
      box-shadow: 0 20px 40px -15px rgba(37, 99, 235, 0.4);
    }
    .cta-banner-content h2 { font-size: 2.5rem; font-weight: 800; margin: 0 0 1rem; }
    .cta-banner-content p { font-size: 1.125rem; opacity: 0.9; margin-bottom: 2rem; }
    .cta-flex { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
    .btn-primary-lg { background: #ffffff; color: #1e40af; font-weight: 700; padding: 0.85rem 2rem; border-radius: 12px; text-decoration: none; }
    .btn-secondary-lg { background: rgba(255,255,255,0.15); color: #ffffff; font-weight: 600; padding: 0.85rem 2rem; border-radius: 12px; text-decoration: none; border: 1px solid rgba(255,255,255,0.3); }
  `],
})
export class HomePageComponent {
  public activeFaq = signal<number | null>(0);

  public faqList = signal([
    {
      q: 'How does CodeLens integrate with our GitHub or GitLab workspace?',
      a: 'CodeLens connects securely via official GitHub Apps or GitLab Webhooks using OAuth2. It automatically scans opened pull requests without needing access to write directly to your master branch.',
    },
    {
      q: 'Does CodeLens train AI models on our proprietary source code?',
      a: 'No. CodeLens operates under strict enterprise Zero Data Retention policies. Your code is processed in volatile memory and deleted immediately after the review complete status is delivered.',
    },
    {
      q: 'Can we define custom coding standards for our team?',
      a: 'Yes! CodeLens supports custom policy files written in plain markdown or YAML where you can define architecture constraints, naming conventions, and linting rules.',
    },
    {
      q: 'Is there a free trial available for engineering teams?',
      a: 'Yes, we offer a full-featured 14-day trial with up to 50 active repositories and unlimited pull request AI audits.',
    },
  ]);

  public toggleFaq(index: number): void {
    this.activeFaq.set(this.activeFaq() === index ? null : index);
  }
}
