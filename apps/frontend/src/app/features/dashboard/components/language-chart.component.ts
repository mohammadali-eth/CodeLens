import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageDistribution } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-language-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-card">
      <h4 class="chart-title">Programming Language Distribution</h4>
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
        <div class="empty-chart">No language breakdown data.</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .chart-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1.25rem;
      backdrop-filter: blur(12px);
    }
    .chart-title {
      font-size: 1rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0 0 1rem;
    }
    .lang-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .lang-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      margin-bottom: 0.25rem;
    }
    .lang-name {
      color: #e2e8f0;
      font-weight: 500;
    }
    .lang-count {
      color: #94a3b8;
    }
    .progress-bar-bg {
      height: 8px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.4s ease;
    }
    .empty-chart {
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-size: 0.85rem;
    }
  `],
})
export class LanguageChartComponent {
  @Input() data: LanguageDistribution[] = [];

  getLangColor(lang: string): string {
    const colors: Record<string, string> = {
      TYPESCRIPT: '#3178c6',
      JAVASCRIPT: '#f7df1e',
      PYTHON: '#3776ab',
      JAVA: '#b07219',
      GO: '#00add8',
      RUST: '#dea584',
      CPP: '#f34b7d',
      CSHARP: '#178600',
    };
    return colors[lang.toUpperCase()] || '#6366f1';
  }
}
