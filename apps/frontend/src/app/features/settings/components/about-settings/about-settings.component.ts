import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsSectionComponent } from '../settings-section/settings-section.component';
import { PreferenceCardComponent } from '../preference-card/preference-card.component';

/**
 * AboutSettingsComponent
 * Purpose: Displays platform system metadata, version numbers, runtime environments, and documentation links.
 * Responsibilities: Render platform version metadata cards.
 * Dependencies: SettingsSectionComponent, PreferenceCardComponent.
 */
@Component({
  selector: 'app-about-settings',
  standalone: true,
  imports: [
    CommonModule,
    SettingsSectionComponent,
    PreferenceCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-settings-section
      title="About CodeLens Platform"
      description="System version details, enterprise license metadata, and technical runtime specs."
      icon="info"
    >
      <div class="about-hero-card">
        <div class="hero-brand">
          <div class="logo-box">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
          </div>
          <div>
            <h3 class="hero-name">CodeLens AI Review Suite</h3>
            <p class="hero-tagline">Enterprise AI-Powered Code Quality & Security Platform</p>
          </div>
        </div>

        <div class="hero-badges">
          <span class="v-badge">v1.4.0-enterprise</span>
          <span class="tier-badge">Enterprise Licensed</span>
        </div>
      </div>

      <!-- Preference Metadata Rows -->
      <app-preference-card
        label="Platform Release Version"
        description="Current installed version of the frontend Angular and backend NestJS engine."
        icon="info"
      >
        <code class="meta-code">v1.4.0 (Build 2026.07.29-PROD)</code>
      </app-preference-card>

      <app-preference-card
        label="Git Release Hash"
        description="Source commit SHA corresponding to current deployment."
        icon="info"
      >
        <code class="meta-code">git-commit-a9d8f7b2</code>
      </app-preference-card>

      <app-preference-card
        label="Framework Runtime"
        description="Frontend framework version and signal engine version."
        icon="info"
      >
        <span class="runtime-info">Angular v17.3 (Signals Reactive Mode)</span>
      </app-preference-card>

      <app-preference-card
        label="Enterprise Support Tier"
        description="24/7 SLA Support tier for organization workspace."
        icon="info"
      >
        <span class="support-chip">24/7 Platinum SLA</span>
      </app-preference-card>
    </app-settings-section>
  `,
  styles: [`
    .about-hero-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
      border: 1px solid var(--color-primary-border, rgba(37, 99, 235, 0.25));
      border-radius: var(--radius-lg, 12px);
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
    }

    .hero-brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-box {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md, 8px);
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .hero-name {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary, #111827);
    }

    .hero-tagline {
      margin: 4px 0 0 0;
      font-size: 0.8125rem;
      color: var(--text-secondary, #4b5563);
    }

    .hero-badges {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .v-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
      background: var(--color-primary-light, #eff6ff);
      color: var(--color-primary, #2563eb);
      border: 1px solid var(--color-primary-border, rgba(37, 99, 235, 0.25));
    }

    .tier-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
      background: var(--success-bg, #ecfdf5);
      color: var(--success-text, #047857);
      border: 1px solid var(--success-border, #a7f3d0);
    }

    .meta-code {
      font-family: 'Fira Code', monospace;
      font-size: 0.8125rem;
      color: var(--color-primary, #2563eb);
      background: var(--bg-app, #f8fafc);
      border: 1px solid var(--border-color, #e5e7eb);
      padding: 4px 8px;
      border-radius: 6px;
    }

    .runtime-info {
      font-size: 0.875rem;
      color: var(--text-primary, #111827);
      font-weight: 500;
    }

    .support-chip {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
      background: #f3e8ff;
      color: #7e22ce;
      border: 1px solid #e9d5ff;
    }
  `],
})
export class AboutSettingsComponent {}
