import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderUsageStat } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-provider-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-card card-panel">
      <div class="header">
        <h4 class="chart-title">AI Provider Breakdown</h4>
        <span class="badge badge-neutral text-xs">Models</span>
      </div>
      
      <div class="provider-grid" *ngIf="data && data.length > 0; else emptyState">
        <div class="provider-item" *ngFor="let item of data">
          <div class="provider-header">
            <span class="provider-name">{{ item.provider | uppercase }}</span>
            <span class="provider-pct">{{ item.percentage }}%</span>
          </div>
          <div class="provider-sub">{{ item.count }} reviews processed</div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-chart">
          <span class="empty-icon">🤖</span>
          <p>No provider statistics data</p>
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
    .provider-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 0.75rem;
    }
    .provider-item {
      background: var(--bg-app);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.75rem 0.85rem;
      transition: border-color 0.15s ease;
    }
    .provider-item:hover {
      border-color: var(--border-medium);
    }
    .provider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }
    .provider-name {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--color-primary);
      letter-spacing: 0.02em;
    }
    .provider-pct {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .provider-sub {
      font-size: 0.7rem;
      color: var(--text-muted);
    }
    .empty-chart {
      height: 100px;
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
export class ProviderChartComponent {
  @Input() data: ProviderUsageStat[] = [];
}

