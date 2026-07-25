import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderUsageStat } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-provider-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-card">
      <h4 class="chart-title">AI Provider Usage Breakdown</h4>
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
        <div class="empty-chart">No provider statistics data.</div>
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
    .provider-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem;
    }
    .provider-item {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 0.85rem;
    }
    .provider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }
    .provider-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: #a855f7;
    }
    .provider-pct {
      font-size: 0.95rem;
      font-weight: 700;
      color: #f8fafc;
    }
    .provider-sub {
      font-size: 0.75rem;
      color: #64748b;
    }
    .empty-chart {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-size: 0.85rem;
    }
  `],
})
export class ProviderChartComponent {
  @Input() data: ProviderUsageStat[] = [];
}
