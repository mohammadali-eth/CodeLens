import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DashboardService,
  UserDashboardSummary,
  QualityTrendPoint,
  LanguageDistribution,
  ProviderUsageStat,
  ActivityTimelineItem,
} from '../../core/services/dashboard.service';
import { StatCardComponent } from './components/stat-card.component';
import { QualityTrendChartComponent } from './components/quality-trend-chart.component';
import { LanguageChartComponent } from './components/language-chart.component';
import { ProviderChartComponent } from './components/provider-chart.component';
import { RecentActivityTimelineComponent } from './components/recent-activity-timeline.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    QualityTrendChartComponent,
    LanguageChartComponent,
    ProviderChartComponent,
    RecentActivityTimelineComponent,
  ],
  template: `
    <div class="dashboard-page animate-fade-in">
      <header class="dashboard-header">
        <div>
          <h1 class="page-title">Analytics Dashboard</h1>
          <p class="page-subtitle">Real-time code review quality metrics and AI performance analytics</p>
        </div>
        <div class="header-filters">
          <div class="date-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>Last 30 Days</span>
          </div>
        </div>
      </header>

      <!-- KPI Summary Cards -->
      <section class="kpi-grid" *ngIf="summary">
        <app-stat-card
          label="Total Code Reviews"
          [value]="summary.totalReviews"
          icon="📝"
          iconBg="#eff6ff"
          [subtext]="summary.reviewsToday + ' created today'"
        ></app-stat-card>

        <app-stat-card
          label="Avg Quality Score"
          [value]="summary.averageQualityScore + '/100'"
          icon="⭐"
          iconBg="#fffbeb"
          subtext="Overall codebase score"
        ></app-stat-card>

        <app-stat-card
          label="Avg Processing Time"
          [value]="(summary.averageProcessingTimeMs / 1000 | number:'1.1-1') + 's'"
          icon="⚡"
          iconBg="#ecfdf5"
          subtext="AI response duration"
        ></app-stat-card>

        <app-stat-card
          label="Top Language"
          [value]="summary.mostUsedLanguage || 'N/A'"
          icon="💻"
          iconBg="#f3e8ff"
          [subtext]="summary.favoriteReviewsCount + ' favorite reviews'"
        ></app-stat-card>
      </section>

      <!-- Charts Section -->
      <section class="charts-grid">
        <div class="main-chart">
          <app-quality-trend-chart [data]="qualityTrend"></app-quality-trend-chart>
        </div>

        <div class="side-charts">
          <app-language-chart [data]="languageStats"></app-language-chart>
          <app-provider-chart [data]="providerUsage"></app-provider-chart>
        </div>
      </section>

      <!-- Activity Section -->
      <section class="activity-section">
        <app-recent-activity-timeline [items]="recentActivities"></app-recent-activity-timeline>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 1.75rem 2rem;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 1.75rem;
    }
    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.02em;
    }
    .page-subtitle {
      color: var(--text-muted);
      font-size: 0.875rem;
      margin: 0.25rem 0 0;
    }
    .date-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      padding: 0.4rem 0.85rem;
      border-radius: var(--radius-md);
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-secondary);
      box-shadow: var(--shadow-xs);
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.75rem;
    }
    .charts-grid {
      display: grid;
      grid-template-columns: 1.8fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.75rem;
    }
    .side-charts {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .activity-section {
      margin-top: 1.75rem;
    }

    @media (max-width: 1024px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class DashboardComponent implements OnInit {
  summary: UserDashboardSummary | null = null;
  qualityTrend: QualityTrendPoint[] = [];
  languageStats: LanguageDistribution[] = [];
  providerUsage: ProviderUsageStat[] = [];
  recentActivities: ActivityTimelineItem[] = [];

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.dashboardService.getSummary().subscribe({
      next: (data) => (this.summary = data),
    });

    this.dashboardService.getQualityTrend(30).subscribe({
      next: (data) => (this.qualityTrend = data),
    });

    this.dashboardService.getLanguageStats().subscribe({
      next: (data) => (this.languageStats = data),
    });

    this.dashboardService.getProviderUsage().subscribe({
      next: (data) => (this.providerUsage = data),
    });

    this.dashboardService.getRecentActivity(15).subscribe({
      next: (data) => (this.recentActivities = data),
    });
  }
}

