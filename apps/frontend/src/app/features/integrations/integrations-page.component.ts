import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Integration {
  name: string;
  category: string;
  description: string;
  connected: boolean;
  icon: string;
}

@Component({
  selector: 'cdl-integrations-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="integrations-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Enterprise Integrations & Webhooks</h1>
          <p class="page-subtitle">Connect CodeLens AI with your existing CI/CD pipelines, VCS providers, and team chat tools</p>
        </div>
      </div>

      <div class="cards-grid">
        <div class="card-panel integration-card" *ngFor="let item of integrations()">
          <div class="card-top">
            <div class="integration-icon">{{ item.icon }}</div>
            <span class="badge" [class.badge-success]="item.connected" [class.badge-neutral]="!item.connected">
              {{ item.connected ? 'Connected' : 'Not Configured' }}
            </span>
          </div>

          <div class="card-body">
            <h3 class="item-name">{{ item.name }}</h3>
            <span class="item-cat">{{ item.category }}</span>
            <p class="item-desc">{{ item.description }}</p>
          </div>

          <div class="card-footer">
            <button class="btn btn-sm" [class.btn-secondary]="item.connected" [class.btn-primary]="!item.connected">
              {{ item.connected ? 'Configure' : 'Connect' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .integrations-page {
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

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.25rem;
    }

    .integration-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1rem;
    }

    .card-top { display: flex; align-items: center; justify-content: space-between; }
    .integration-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .card-body { display: flex; flex-direction: column; }
    .item-name { font-size: 1.05rem; font-weight: 600; color: #111827; margin: 0; }
    .item-cat { font-size: 0.725rem; color: #2563eb; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0.2rem 0 0.5rem; }
    .item-desc { font-size: 0.8rem; color: #6b7280; margin: 0; line-height: 1.4; }

    .card-footer { display: flex; justify-content: flex-end; padding-top: 0.5rem; border-top: 1px solid #f1f5f9; }
  `],
})
export class IntegrationsPageComponent {
  public integrations = signal<Integration[]>([
    {
      name: 'GitHub Enterprise',
      category: 'VCS Provider',
      description: 'Automated PR check runs, line comments, and AI inline suggestions directly on pull requests.',
      connected: true,
      icon: '🐙',
    },
    {
      name: 'Slack Notifications',
      category: 'Team Communication',
      description: 'Receive real-time alerts when AI detects critical vulnerabilities or security risks.',
      connected: true,
      icon: '💬',
    },
    {
      name: 'Jira Software',
      category: 'Issue Tracking',
      description: 'Automatically convert AI review findings into structured Jira engineering tickets.',
      connected: false,
      icon: '📐',
    },
    {
      name: 'Datadog Observability',
      category: 'APM & Telemetry',
      description: 'Stream AI review latency and execution telemetry directly to Datadog dashboards.',
      connected: false,
      icon: '📊',
    },
  ]);
}
