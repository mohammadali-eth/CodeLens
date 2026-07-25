import {
  UserDashboardSummary,
  AdminDashboardSummary,
  QualityTrendPoint,
  LanguageDistribution,
  ProviderUsageStat,
  ActivityTimelineItem,
} from '../../domain/dashboard-analytics.value-objects';

export interface DashboardFilterOptions {
  startDate?: Date;
  endDate?: Date;
  language?: string;
  aiProvider?: string;
  status?: string;
}

export interface IAnalyticsRepository {
  getUserSummary(
    userId: string,
    filters?: DashboardFilterOptions,
  ): Promise<UserDashboardSummary>;
  getAdminSummary(): Promise<AdminDashboardSummary>;
  getQualityTrend(userId?: string, days?: number): Promise<QualityTrendPoint[]>;
  getLanguageStats(userId?: string): Promise<LanguageDistribution[]>;
  getProviderUsage(userId?: string): Promise<ProviderUsageStat[]>;
  getRecentActivities(
    userId?: string,
    limit?: number,
  ): Promise<ActivityTimelineItem[]>;
}

export const IAnalyticsRepository = Symbol('IAnalyticsRepository');
