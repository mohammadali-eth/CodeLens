import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'cdl-about-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-wrapper">
      <!-- Hero -->
      <section class="page-hero">
        <span class="sub-tag">OUR MISSION & VISION</span>
        <h1 class="page-title">Empowering Engineers to Build Flawless Software</h1>
        <p class="page-lead">
          We are building the future of automated code governance. CodeLens combines advanced large language models with static code analysis to eliminate tedious code reviews and secure the software supply chain.
        </p>
      </section>

      <!-- Stats Grid -->
      <section class="content-section">
        <div class="grid-3">
          <div class="card-box">
            <h3 class="highlight-title">Mission</h3>
            <p>To eliminate code review bottlenecks so developers can focus on shipping creative, impactful features securely.</p>
          </div>
          <div class="card-box">
            <h3 class="highlight-title">Vision</h3>
            <p>An enterprise world where software security, performance, and maintainability are guaranteed automatically by AI guardrails.</p>
          </div>
          <div class="card-box">
            <h3 class="highlight-title">Our Story</h3>
            <p>Founded in 2024 by senior SREs and security architects tired of waiting 48 hours for code reviews across complex monorepos.</p>
          </div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="content-section light-bg">
        <div class="section-center">
          <span class="sub-tag">ENGINEERING EXCELLENCE</span>
          <h2>Enterprise-Grade Technology Stack</h2>
          <p class="section-desc">Architected for resilience, low latency, and maximum security compliance.</p>

          <div class="tech-grid">
            <div class="tech-chip">
              <span class="tech-icon">⚡</span>
              <div>
                <strong>Angular 17</strong>
                <p>Reactive signals & standalone architecture</p>
              </div>
            </div>
            <div class="tech-chip">
              <span class="tech-icon">🛡️</span>
              <div>
                <strong>NestJS Backend</strong>
                <p>Enterprise microservices API transport</p>
              </div>
            </div>
            <div class="tech-chip">
              <span class="tech-icon">💾</span>
              <div>
                <strong>PostgreSQL & Redis</strong>
                <p>High-throughput data storage & caching</p>
              </div>
            </div>
            <div class="tech-chip">
              <span class="tech-icon">🧠</span>
              <div>
                <strong>Multi-LLM Engine</strong>
                <p>Fine-tuned LLM models with zero data retention</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Values -->
      <section class="content-section">
        <div class="section-center">
          <span class="sub-tag">CULTURE & PHILOSOPHY</span>
          <h2>Our Core Values</h2>
        </div>

        <div class="grid-3">
          <div class="val-card">
            <span class="val-num">01</span>
            <h4>Security First</h4>
            <p>Zero retention policies and AES-256 encryption are baked into every line of code we write.</p>
          </div>
          <div class="val-card">
            <span class="val-num">02</span>
            <h4>Developer Velocity</h4>
            <p>Tools should empower developers, not slow them down with bureaucracy or false positives.</p>
          </div>
          <div class="val-card">
            <span class="val-num">03</span>
            <h4>Continuous Innovation</h4>
            <p>We continuously benchmark against top AI research to provide state-of-the-art code analysis.</p>
          </div>
        </div>
      </section>

      <!-- Team -->
      <section class="content-section light-bg">
        <div class="section-center">
          <span class="sub-tag">LEADERSHIP</span>
          <h2>Built by Engineers for Engineers</h2>
        </div>

        <div class="team-grid">
          <div class="team-card">
            <div class="team-avatar">MA</div>
            <h4>Mohammad Ali</h4>
            <p class="team-role">Founder & Chief Architect</p>
            <p class="team-bio">Ex-Senior SRE with 10+ years scaling cloud infrastructure and enterprise security.</p>
          </div>
          <div class="team-card">
            <div class="team-avatar">EL</div>
            <h4>Elena Rostova</h4>
            <p class="team-role">Head of AI Research</p>
            <p class="team-bio">Specializing in program synthesis, static analysis, and LLM code evaluation models.</p>
          </div>
          <div class="team-card">
            <div class="team-avatar">DK</div>
            <h4>David Kim</h4>
            <p class="team-role">VP of Product</p>
            <p class="team-bio">Former Product Director driving developer experience and UX across SaaS tools.</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="bottom-cta">
        <h2>Ready to upgrade your engineering workflow?</h2>
        <a routerLink="/signup" class="btn-primary">Join CodeLens Today</a>
      </section>
    </div>
  `,
  styles: [`
    .page-wrapper { width: 100%; background: #f8fafc; font-family: 'Inter', sans-serif; }
    :host-context([data-theme="dark"]) .page-wrapper { background: #0f172a; }

    .page-hero { max-width: 900px; margin: 0 auto; padding: 5rem 1.5rem 3rem; text-align: center; }
    .sub-tag { font-size: 0.75rem; font-weight: 800; color: #2563eb; letter-spacing: 0.1em; }
    .page-title { font-size: 3rem; font-weight: 800; color: #111827; margin: 0.5rem 0 1.25rem; letter-spacing: -0.025em; }
    :host-context([data-theme="dark"]) .page-title { color: #ffffff; }
    .page-lead { font-size: 1.15rem; color: #4b5563; line-height: 1.6; }
    :host-context([data-theme="dark"]) .page-lead { color: #94a3b8; }

    .content-section { max-width: 1280px; margin: 0 auto; padding: 4rem 1.5rem; }
    .light-bg { background: #ffffff; border-y: 1px solid #e5e7eb; }
    :host-context([data-theme="dark"]) .light-bg { background: #0b0f19; }

    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .card-box { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 2rem; }
    :host-context([data-theme="dark"]) .card-box { background: #1e293b; border-color: #334155; }
    .highlight-title { font-size: 1.35rem; font-weight: 700; color: #2563eb; margin: 0 0 0.75rem; }
    .card-box p { color: #4b5563; line-height: 1.6; margin: 0; }
    :host-context([data-theme="dark"]) .card-box p { color: #94a3b8; }

    .section-center { text-align: center; max-width: 600px; margin: 0 auto 3rem; }
    .section-center h2 { font-size: 2rem; font-weight: 800; color: #111827; margin: 0.5rem 0 0.5rem; }
    :host-context([data-theme="dark"]) .section-center h2 { color: #ffffff; }
    .section-desc { color: #6b7280; margin: 0; }

    .tech-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 2rem; text-align: left; }
    .tech-chip { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; display: flex; gap: 1rem; align-items: center; }
    :host-context([data-theme="dark"]) .tech-chip { background: #1e293b; border-color: #334155; }
    .tech-icon { font-size: 1.5rem; }
    .tech-chip strong { display: block; color: #111827; font-size: 0.95rem; }
    :host-context([data-theme="dark"]) .tech-chip strong { color: #ffffff; }
    .tech-chip p { margin: 0; font-size: 0.8rem; color: #6b7280; }

    .val-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 2rem; }
    :host-context([data-theme="dark"]) .val-card { background: #1e293b; border-color: #334155; }
    .val-num { font-size: 1.75rem; font-weight: 900; color: #2563eb; }
    .val-card h4 { font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0.5rem 0; }
    :host-context([data-theme="dark"]) .val-card h4 { color: #ffffff; }
    .val-card p { color: #6b7280; font-size: 0.875rem; line-height: 1.6; margin: 0; }

    .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
    .team-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2rem; text-align: center; }
    :host-context([data-theme="dark"]) .team-card { background: #1e293b; border-color: #334155; }
    .team-avatar { width: 64px; height: 64px; border-radius: 50%; background: #2563eb; color: #fff; font-weight: 800; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
    .team-card h4 { font-size: 1.1rem; font-weight: 700; color: #111827; margin: 0 0 0.25rem; }
    :host-context([data-theme="dark"]) .team-card h4 { color: #ffffff; }
    .team-role { font-size: 0.8rem; font-weight: 600; color: #2563eb; margin: 0 0 0.75rem; }
    .team-bio { font-size: 0.825rem; color: #6b7280; line-height: 1.5; margin: 0; }

    .bottom-cta { max-width: 1280px; margin: 0 auto; padding: 4rem 1.5rem 6rem; text-align: center; }
    .bottom-cta h2 { font-size: 2rem; font-weight: 800; color: #111827; margin-bottom: 1.5rem; }
    :host-context([data-theme="dark"]) .bottom-cta h2 { color: #ffffff; }
    .btn-primary { background: #2563eb; color: #fff; font-weight: 700; padding: 0.85rem 2rem; border-radius: 12px; text-decoration: none; display: inline-block; }
  `],
})
export class AboutPageComponent {}
