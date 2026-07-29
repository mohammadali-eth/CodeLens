/**
 * Admin Dashboard & Platform Overview Interfaces & DTO Models
 * Purpose: Defines strong typing contracts for platform KPIs, system health, background queue, AI usage, and activity timeline.
 * Responsibilities: Request/response payloads matching NestJS admin dashboard endpoints.
 * Dependencies: Independent domain types used by services, stores, and dashboard components.
 */

export type HealthStatusLevel = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export interface SystemHealthMetric {
  name: string;
  status: HealthStatusLevel;
  latencyMs?: number;
  message?: string;
  lastCheckedAt: string;
}

export interface SystemHealthOverview {
  api: SystemHealthMetric;
  database: SystemHealthMetric;
  redis: SystemHealthMetric;
  queue: SystemHealthMetric;
  aiProvider: SystemHealthMetric;
  websocket: SystemHealthMetric;
  overallStatus: HealthStatusLevel;
}

export interface AdminDashboardSummary {
  totalUsers: number;
  activeUsers: number;
  newRegistrationsThisMonth: number;
  totalReviews: number;
  reviewsToday: number;
  reviewsThisWeek?: number;
  reviewsThisMonth?: number;
  globalAverageQualityScore: number;
  chatSessionsCount?: number;
  reportsGeneratedCount?: number;
  mostActiveUser?: {
    id: string;
    name: string | null;
    email: string;
    reviewsCount: number;
  } | null;
  mostPopularLanguage?: string | null;
  mostUsedAIProvider?: string | null;
}

export interface KpiMetric {
  id: string;
  title: string;
  value: string | number;
  changePercentage?: number;
  trend?: 'up' | 'down' | 'neutral';
  timeframe?: string;
  icon?: string;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'purple';
}

export interface QueueStatus {
  activeJobs: number;
  pendingJobs: number;
  completedJobs: number;
  failedJobs: number;
  throughputPerMinute: number;
  averageProcessingTimeMs: number;
  lastJobProcessedAt?: string;
}

export interface AIProviderUsage {
  provider: string;
  model: string;
  tokensConsumed: number;
  totalRequests: number;
  successRate: number;
  failureRate: number;
  averageResponseTimeMs: number;
}

export interface ActivityTimelineItem {
  id: string;
  action: string;
  userEmail?: string;
  details: string | null;
  severity?: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
}

export interface QualityTrendPoint {
  date: string;
  averageScore: number;
  reviewCount: number;
}

export interface LanguageDistribution {
  language: string;
  count: number;
  percentage: number;
}

export interface ProviderUsageStat {
  provider: string;
  count: number;
  percentage: number;
}
