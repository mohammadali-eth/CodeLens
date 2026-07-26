import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageDistribution } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-language-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-card card-panel">
      <div class="header">
        <h4 class="chart-title">Language Distribution</h4>
        <span class="badge badge-neutral text-xs">By File Count</span>
      </div>

      <div class="lang-list" *ngIf="data && data.length > 0; else emptyState">
        <div class="lang-item" *ngFor="let item of data">
          <div class="lang-info">
            <span class="lang-name">{{ item.language }}</span>
            <span class="lang-count">{{ item.count }} files ({{ item.percentage }}%)</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" [style.width.%]="item.percentage" [style.background-color]="getLangColor(item.language)"></div>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-chart">
          <span class="empty-icon">💻</span>
          <p>No language breakdown data</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .chart-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      box-shadow: var(--shadow-sm);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .chart-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.01em;
    }
    .lang-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .lang-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      margin-bottom: 0.35rem;
    }
    .lang-name {
      color: var(--text-secondary);
      font-weight: 600;
    }
    .lang-count {
      color: var(--text-muted);
      font-size: 0.75rem;
    }
    .progress-bar-bg {
      height: 6px;
      background: var(--bg-surface-secondary);
      border-radius: var(--radius-full);
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      border-radius: var(--radius-full);
      transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .empty-chart {
      height: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      font-size: 0.8rem;
      background: var(--bg-app);
      border: 1px dashed var(--border-medium);
      border-radius: var(--radius-md);
      gap: 0.25rem;
    }
    .empty-icon {
      font-size: 1.25rem;
    }
  `],
})
export class LanguageChartComponent {
  @Input() data: LanguageDistribution[] = [];

  getLangColor(lang: string): string {
    const colors: Record<string, string> = {
      TYPESCRIPT: '#2563eb',
      JAVASCRIPT: '#f59e0b',
      PYTHON: '#3b82f6',
      JAVA: '#d97706',
      GO: '#0891b2',
      RUST: '#ea580c',
      CPP: '#e11d48',
      CSHARP: '#059669',
    };
    return colors[lang.toUpperCase()] || '#2563eb';
  }
}

