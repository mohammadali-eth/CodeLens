import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PullRequest {
  id: string;
  number: number;
  title: string;
  author: string;
  authorAvatar: string;
  branch: string;
  additions: number;
  deletions: number;
  status: 'AI Approved' | 'Changes Requested' | 'In Review';
  aiScore: number;
  updatedAt: string;
}

@Component({
  selector: 'cdl-pull-requests-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pr-page animate-fade-in">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Pull Requests & Code Reviews</h1>
          <p class="page-subtitle">Automated AI code review audits and pull request diagnostics across repositories</p>
        </div>

        <div class="header-actions">
          <button class="btn btn-secondary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filter PRs
          </button>
          <button class="btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Review Audit
          </button>
        </div>
      </div>

      <!-- KPI Stat Grid -->
      <div class="kpi-grid">
        <div class="card-panel kpi-card">
          <div class="kpi-icon icon-blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="18" r="3"/>
              <circle cx="6" cy="6" r="3"/>
              <path d="M13 6h3a2 2 0 0 1 2 2v7"/>
              <line x1="6" y1="9" x2="6" y2="21"/>
            </svg>
          </div>
          <div class="kpi-details">
            <span class="kpi-label">Active Open PRs</span>
            <span class="kpi-value">14</span>
          </div>
        </div>

        <div class="card-panel kpi-card">
          <div class="kpi-icon icon-green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="kpi-details">
            <span class="kpi-label">AI Auto-Approved</span>
            <span class="kpi-value">92%</span>
          </div>
        </div>

        <div class="card-panel kpi-card">
          <div class="kpi-icon icon-purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="kpi-details">
            <span class="kpi-label">Avg Review Speed</span>
            <span class="kpi-value">1.8s</span>
          </div>
        </div>
      </div>

      <!-- PR Table Panel -->
      <div class="card-panel table-card">
        <div class="table-header">
          <h2 class="table-title">Open Pull Requests</h2>
          <span class="badge badge-primary">4 Requiring Action</span>
        </div>

        <div class="table-responsive">
          <table class="custom-table">
            <thead>
              <tr>
                <th>PULL REQUEST</th>
                <th>AUTHOR</th>
                <th>BRANCH</th>
                <th>CHANGES</th>
                <th>AI SCORE</th>
                <th>STATUS</th>
                <th style="text-align: right;">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let pr of pullRequests()">
                <td>
                  <div class="pr-info">
                    <span class="pr-title">{{ pr.title }}</span>
                    <span class="pr-id">#{{ pr.number }} • Updated {{ pr.updatedAt }}</span>
                  </div>
                </td>
                <td>
                  <div class="author-box">
                    <div class="author-avatar">{{ pr.authorAvatar }}</div>
                    <span class="author-name">{{ pr.author }}</span>
                  </div>
                </td>
                <td><code class="branch-pill">{{ pr.branch }}</code></td>
                <td>
                  <span class="diff-stats">
                    <span class="additions">+{{ pr.additions }}</span>
                    <span class="deletions">-{{ pr.deletions }}</span>
                  </span>
                </td>
                <td>
                  <span class="score-chip" [class.high]="pr.aiScore >= 90" [class.medium]="pr.aiScore < 90 && pr.aiScore >= 80">
                    {{ pr.aiScore }}/100
                  </span>
                </td>
                <td>
                  <span class="badge" [class.badge-success]="pr.status === 'AI Approved'" [class.badge-warning]="pr.status === 'Changes Requested'" [class.badge-primary]="pr.status === 'In Review'">
                    {{ pr.status }}
                  </span>
                </td>
                <td style="text-align: right;">
                  <button class="btn btn-sm btn-secondary">Review Diff</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pr-page {
      padding: 1.75rem;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.25rem;
    }

    .page-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }

    .kpi-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
    }

    .kpi-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-blue { background: #eff6ff; color: #2563eb; }
    .icon-green { background: #ecfdf5; color: #10b981; }
    .icon-purple { background: #f3e8ff; color: #9333ea; }

    .kpi-details { display: flex; flex-direction: column; }
    .kpi-label { font-size: 0.75rem; color: #6b7280; font-weight: 500; }
    .kpi-value { font-size: 1.5rem; font-weight: 700; color: #111827; }

    .table-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .table-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .table-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .custom-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    .custom-table th {
      text-align: left;
      padding: 0.75rem 1rem;
      font-size: 0.7rem;
      font-weight: 700;
      color: #6b7280;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #e5e7eb;
      background: #f8fafc;
    }

    .custom-table td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .pr-info { display: flex; flex-direction: column; }
    .pr-title { font-weight: 600; color: #111827; }
    .pr-id { font-size: 0.75rem; color: #6b7280; }

    .author-box { display: flex; align-items: center; gap: 0.5rem; }
    .author-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #2563eb;
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .author-name { font-weight: 500; color: #374151; }

    .branch-pill {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-family: monospace;
      font-size: 0.75rem;
      color: #475569;
    }

    .diff-stats { font-weight: 600; font-size: 0.8rem; }
    .additions { color: #10b981; margin-right: 0.3rem; }
    .deletions { color: #ef4444; }

    .score-chip {
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
    }
    .score-chip.high { background: #ecfdf5; color: #047857; }
    .score-chip.medium { background: #fffbeb; color: #b45309; }
  `],
})
export class PullRequestsPageComponent {
  public pullRequests = signal<PullRequest[]>([
    {
      id: 'pr-1',
      number: 142,
      title: 'Refactor Authentication JWT Middleware & Token Rotation',
      author: 'Mohammad Ali',
      authorAvatar: 'MA',
      branch: 'feature/auth-jwt-rotation',
      additions: 128,
      deletions: 34,
      status: 'AI Approved',
      aiScore: 94,
      updatedAt: '12m ago',
    },
    {
      id: 'pr-2',
      number: 139,
      title: 'Optimize Redis Cache Strategy for Review Diagnostics',
      author: 'Sarah Chen',
      authorAvatar: 'SC',
      branch: 'fix/redis-cache-layer',
      additions: 45,
      deletions: 12,
      status: 'In Review',
      aiScore: 88,
      updatedAt: '1h ago',
    },
    {
      id: 'pr-3',
      number: 135,
      title: 'Add Async Exception Handlers in Review Controller',
      author: 'Alex Rivera',
      authorAvatar: 'AR',
      branch: 'refactor/exception-handlers',
      additions: 89,
      deletions: 62,
      status: 'Changes Requested',
      aiScore: 78,
      updatedAt: '3h ago',
    },
  ]);
}
