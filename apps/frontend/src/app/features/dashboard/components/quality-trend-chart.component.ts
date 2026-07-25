import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityTrendPoint } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-quality-trend-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div class="chart-header">
        <h4 class="chart-title">Code Quality Score History</h4>
        <span class="chart-badge">Past {{ data.length }} Data Points</span>
      </div>

      <div class="svg-wrapper" *ngIf="data && data.length > 0; else emptyState">
        <svg viewBox="0 0 500 150" class="trend-svg">
          <!-- Grid lines -->
          <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />
          <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />
          <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4" />

          <!-- Gradient Area -->
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#6366f1" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#6366f1" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- Score Polyline -->
          <polyline
            fill="url(#scoreGrad)"
            stroke="#6366f1"
            stroke-width="3"
            [attr.points]="polyPoints"
          />

          <!-- Data Dots -->
          <circle
            *ngFor="let pt of chartPoints"
            [attr.cx]="pt.x"
            [attr.cy]="pt.y"
            r="4"
            fill="#a855f7"
          />
        </svg>

        <div class="chart-footer">
          <span>{{ firstDate }}</span>
          <span>{{ lastDate }}</span>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-chart">
          <p>No historical quality data available yet.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .chart-container {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1.25rem;
      backdrop-filter: blur(12px);
    }
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .chart-title {
      font-size: 1rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0;
    }
    .chart-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.6rem;
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      border-radius: 20px;
    }
    .svg-wrapper {
      width: 100%;
    }
    .trend-svg {
      width: 100%;
      height: 150px;
      overflow: visible;
    }
    .chart-footer {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 0.5rem;
    }
    .empty-chart {
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-size: 0.85rem;
    }
  `],
})
export class QualityTrendChartComponent {
  private _data: QualityTrendPoint[] = [];

  chartPoints: { x: number; y: number }[] = [];
  polyPoints = '';
  firstDate = '';
  lastDate = '';

  @Input() set data(val: QualityTrendPoint[]) {
    this._data = val || [];
    this.calculatePoints();
  }
  get data(): QualityTrendPoint[] {
    return this._data;
  }

  private calculatePoints(): void {
    if (!this._data || this._data.length === 0) {
      this.chartPoints = [];
      this.polyPoints = '';
      return;
    }

    this.firstDate = this._data[0].date;
    this.lastDate = this._data[this._data.length - 1].date;

    const width = 500;
    const height = 150;
    const padding = 20;

    const step = this._data.length > 1 ? (width - padding * 2) / (this._data.length - 1) : 0;

    this.chartPoints = this._data.map((pt, i) => {
      const x = padding + i * step;
      // Score ranges 0-100 mapped to height range 130 -> 20
      const y = height - padding - (pt.averageScore / 100) * (height - padding * 2);
      return { x, y };
    });

    const pts = this.chartPoints.map((p) => `${p.x},${p.y}`).join(' ');
    // Close path for SVG gradient fill
    const firstX = this.chartPoints[0].x;
    const lastX = this.chartPoints[this.chartPoints.length - 1].x;
    this.polyPoints = `${firstX},${height} ${pts} ${lastX},${height}`;
  }
}
