export const ADMIN_ANALYTICS_REPOSITORY = Symbol('ADMIN_ANALYTICS_REPOSITORY');

export interface PlatformOverviewMetrics {
  totalUsers: number;
  activeUsers: number;
  newRegistrationsToday: number;
  totalReviews: number;
  reviewsToday: number;
  averageQualityScore: number;
  averageProcessingTimeMs: number;
  totalStorageBytes: number;
}

export interface AIProviderStats {
  provider: string;
  totalRequests: number;
  percentage: number;
}

export interface QueueStatistics {
  pendingReviews: number;
  processingReviews: number;
  failedReviews: number;
  completedToday: number;
}

export interface SystemMetricsResult {
  overview: PlatformOverviewMetrics;
  aiProviderStats: AIProviderStats[];
  queueStats: QueueStatistics;
}

export interface IAdminAnalyticsRepository {
  getPlatformOverview(): Promise<PlatformOverviewMetrics>;
  getAIProviderUsage(): Promise<AIProviderStats[]>;
  getQueueStatistics(): Promise<QueueStatistics>;
  getSystemMetrics(): Promise<SystemMetricsResult>;
}
