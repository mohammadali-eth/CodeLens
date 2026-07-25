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
    <div class="dashboard-page">
      <header class="dashboard-header">
        <div>
          <h1 class="page-title">Analytics Dashboard</h1>
          <p class="page-subtitle">Real-time code review quality metrics and AI performance analytics</p>
        </div>
      </header>

      <!-- KPI Summary Cards -->
      <section class="kpi-grid" *ngIf="summary">
        <app-stat-card
          label="Total Code Reviews"
          [value]="summary.totalReviews"
          icon="📝"
          iconBg="rgba(99, 102, 241, 0.15)"
          [subtext]="summary.reviewsToday + ' created today'"
        ></app-stat-card>

        <app-stat-card
          label="Avg Quality Score"
          [value]="summary.averageQualityScore + '/100'"
          icon="⭐"
          iconBg="rgba(234, 179, 8, 0.15)"
          subtext="Overall codebase score"
        ></app-stat-card>

        <app-stat-card
          label="Avg Processing Time"
          [value]="(summary.averageProcessingTimeMs / 1000 | number:'1.1-1') + 's'"
          icon="⚡"
          iconBg="rgba(16, 185, 129, 0.15)"
          subtext="AI response duration"
        ></app-stat-card>

        <app-stat-card
          label="Top Language"
          [value]="summary.mostUsedLanguage || 'N/A'"
          icon="💻"
          iconBg="rgba(168, 85, 247, 0.15)"
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
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      color: #f8fafc;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .dashboard-header {
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .page-subtitle {
      color: #94a3b8;
      font-size: 0.95rem;
      margin: 0.25rem 0 0;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .charts-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .side-charts {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .activity-section {
      margin-top: 2rem;
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
