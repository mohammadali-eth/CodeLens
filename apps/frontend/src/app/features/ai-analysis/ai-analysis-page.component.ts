import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cdl-ai-analysis-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="analysis-page animate-fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">AI Deep Codebase Inspection</h1>
          <p class="page-subtitle">Architectural health radar, cyclomatic complexity index, and technical debt analysis</p>
        </div>
        <button class="btn btn-primary" (click)="triggerAnalysis()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Run Codebase Inspection
        </button>
      </div>

      <div class="metrics-row">
        <div class="card-panel metric-card">
          <div class="metric-top">
            <span class="metric-title">Cyclomatic Complexity</span>
            <span class="badge badge-success">Low Risk</span>
          </div>
          <div class="metric-body">
            <span class="big-score">3.4</span>
            <span class="score-sub">avg per function</span>
          </div>
          <div class="progress-bar"><div class="progress-fill fill-green" style="width: 25%;"></div></div>
        </div>

        <div class="card-panel metric-card">
          <div class="metric-top">
            <span class="metric-title">Code Duplication</span>
            <span class="badge badge-success">0.8%</span>
          </div>
          <div class="metric-body">
            <span class="big-score">142</span>
            <span class="score-sub">duplicated lines total</span>
          </div>
          <div class="progress-bar"><div class="progress-fill fill-blue" style="width: 12%;"></div></div>
        </div>

        <div class="card-panel metric-card">
          <div class="metric-top">
            <span class="metric-title">Test Coverage Index</span>
            <span class="badge badge-primary">94.2%</span>
          </div>
          <div class="metric-body">
            <span class="big-score">94.2%</span>
            <span class="score-sub">1,420 unit tests passed</span>
          </div>
          <div class="progress-bar"><div class="progress-fill fill-purple" style="width: 94.2%;"></div></div>
        </div>
      </div>

      <div class="card-panel insights-panel">
        <h2 class="panel-heading">Architectural Recommendations</h2>
        <div class="insight-list">
          <div class="insight-item">
            <div class="insight-icon icon-yellow">⚡</div>
            <div class="insight-content">
              <span class="insight-title">Unused Dependency Cleanup</span>
              <p class="insight-desc">Found 3 unused npm packages in <code>apps/backend/package.json</code>. Removing them saves 14MB bundle weight.</p>
            </div>
            <button class="btn btn-sm btn-secondary">Apply Fix</button>
          </div>

          <div class="insight-item">
            <div class="insight-icon icon-blue">💡</div>
            <div class="insight-content">
              <span class="insight-title">Extract Service Abstraction</span>
              <p class="insight-desc"><code>ReviewResultPageComponent</code> exceeds 240 lines. Consider splitting score calculations into a dedicated Service signal.</p>
            </div>
            <button class="btn btn-sm btn-secondary">Refactor</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analysis-page {
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

    .metrics-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .metric-card { display: flex; flex-direction: column; gap: 0.75rem; }
    .metric-top { display: flex; align-items: center; justify-content: space-between; }
    .metric-title { font-size: 0.85rem; font-weight: 600; color: #4b5563; }

    .big-score { font-size: 2rem; font-weight: 800; color: #111827; }
    .score-sub { font-size: 0.75rem; color: #9ca3af; margin-left: 0.4rem; }

    .progress-bar { height: 6px; background: #f1f5f9; border-radius: 9999px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 9999px; }
    .fill-green { background: #10b981; }
    .fill-blue { background: #2563eb; }
    .fill-purple { background: #9333ea; }

    .insights-panel { display: flex; flex-direction: column; gap: 1rem; }
    .panel-heading { font-size: 1.1rem; font-weight: 600; color: #111827; margin: 0; }

    .insight-list { display: flex; flex-direction: column; gap: 0.85rem; }
    .insight-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      background: #ffffff;
    }

    .insight-icon {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }
    .icon-yellow { background: #fffbeb; }
    .icon-blue { background: #eff6ff; }

    .insight-content { flex: 1; }
    .insight-title { font-weight: 600; color: #111827; font-size: 0.9rem; }
    .insight-desc { font-size: 0.8rem; color: #6b7280; margin: 0.2rem 0 0; }
  `],
})
export class AiAnalysisPageComponent {
  public triggerAnalysis(): void {
    alert('Triggered AI Deep Codebase Inspection!');
  }
}
