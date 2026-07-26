import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityTrendPoint } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-quality-trend-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container card-panel">
      <div class="chart-header">
        <div>
          <h4 class="chart-title">Code Quality Score History</h4>
          <p class="chart-subtitle">Historical trend of automated quality reviews</p>
        </div>
        <span class="badge badge-primary">Past {{ data.length }} Data Points</span>
      </div>

      <div class="svg-wrapper" *ngIf="data && data.length > 0; else emptyState">
        <svg viewBox="0 0 500 150" class="trend-svg">
          <!-- Grid lines -->
          <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="4 4" />
          <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="4 4" />
          <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="4 4" />

          <!-- Gradient Area -->
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2563eb" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- Score Polyline -->
          <polyline
            fill="url(#scoreGrad)"
            stroke="#2563eb"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            [attr.points]="polyPoints"
          />

          <!-- Data Dots -->
          <circle
            *ngFor="let pt of chartPoints"
            [attr.cx]="pt.x"
            [attr.cy]="pt.y"
            r="4"
            fill="#ffffff"
            stroke="#2563eb"
            stroke-width="2.5"
          />
        </svg>

        <div class="chart-footer">
          <span>{{ firstDate }}</span>
          <span>{{ lastDate }}</span>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-chart">
          <div class="empty-icon">📈</div>
          <p class="empty-title">No historical quality data available yet</p>
          <p class="empty-desc">Submit new code reviews in the workspace to start tracking codebase quality trends over time.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .chart-container {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
    }
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.25rem;
    }
    .chart-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.01em;
    }
    .chart-subtitle {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin: 0.2rem 0 0;
    }
    .svg-wrapper {
      width: 100%;
    }
    .trend-svg {
      width: 100%;
      height: 160px;
      overflow: visible;
    }
    .chart-footer {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-muted);
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-subtle);
    }
    .empty-chart {
      height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: var(--bg-app);
      border: 1px dashed var(--border-medium);
      border-radius: var(--radius-md);
      padding: 1.5rem;
    }
    .empty-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .empty-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem;
    }
    .empty-desc {
      font-size: 0.775rem;
      color: var(--text-muted);
      margin: 0;
      max-width: 320px;
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

