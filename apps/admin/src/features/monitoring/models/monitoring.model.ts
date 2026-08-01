/**
 * Purpose: TypeScript Domain Models & Interfaces for Platform Analytics & Monitoring.
 * Responsibilities: Provides strong typing for health statuses, performance metrics, queue statistics, AI token analytics, user/review analytics, and system alerts.
 * Dependencies: None.
 */

export type SystemHealthStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export type LogCategory = 'application' | 'queue' | 'security' | 'database' | 'ai';

export interface ComponentHealth {
  id: string;
  name: string;
  category: 'INFRASTRUCTURE' | 'DATABASE' | 'QUEUE' | 'AI_PROVIDER' | 'GATEWAY' | 'STORAGE';
  status: SystemHealthStatus;
  latencyMs: number;
  message?: string;
  lastChecked: string;
  details?: Record<string, any>;
}

export interface SystemHealthSummary {
  overallStatus: SystemHealthStatus;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  offlineCount: number;
  components: ComponentHealth[];
  lastUpdated: string;
}

export interface SystemMetrics {
  cpuUsagePercent: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  memoryUsagePercent: number;
  diskUsedGb: number;
  diskTotalGb: number;
  diskUsagePercent: number;
  networkRxKbps: number;
  networkTxKbps: number;
  activeConnections: number;
  httpRequestsPerMin: number;
  avgResponseTimeMs: number;
  errorRatePercent: number;
  successRatePercent: number;
  timestamp: string;
}

export interface QueueMetrics {
  queueName: string;
  pendingJobs: number;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  delayedJobs: number;
  retryJobs: number;
  deadLetterJobs: number;
  workerThroughputPerSec: number;
  avgProcessingTimeMs: number;
}

export interface QueueMetricsSummary {
  totalPending: number;
  totalActive: number;
  totalCompleted: number;
  totalFailed: number;
  totalDelayed: number;
  totalDeadLetter: number;
  queues: QueueMetrics[];
  updatedAt: string;
}

export interface ProviderUsageDistribution {
  provider: string;
  callsCount: number;
  tokensUsed: number;
  percentage: number;
  costEstimate: number;
  avgLatencyMs: number;
  errorCount: number;
}

export interface ModelUsageBreakdown {
  model: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface AIAnalyticsData {
  totalCalls: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokens: number;
  totalCostUsd: number;
  avgLatencyMs: number;
  failureRatePercent: number;
  providerDistribution: ProviderUsageDistribution[];
  modelBreakdown: ModelUsageBreakdown[];
  timeSeries: {
    timestamp: string;
    tokens: number;
    cost: number;
    latencyMs: number;
  }[];
}

export interface UserAnalyticsData {
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  totalRegistrations: number;
  userGrowthPercent: number;
  newUsersToday: number;
  activeSessions: number;
  dauTrend: { date: string; dau: number; mau: number }[];
  registrationTrend: { date: string; count: number }[];
}

export interface ReviewAnalyticsData {
  totalReviews: number;
  reviewsPerMinute: number;
  completedCount: number;
  failedCount: number;
  avgQualityScore: number;
  avgDurationMs: number;
  qualityTrend: { date: string; score: number }[];
  volumeTrend: { date: string; count: number }[];
  complexityTrend: { date: string; avgTimeComplexityScore: number }[];
  languageDistribution: { language: string; count: number; percentage: number }[];
}

export interface SystemAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  component: string;
  source: string;
  timestamp: string;
  isAcknowledged: boolean;
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  source: string;
  message: string;
  meta?: Record<string, any>;
}

export interface OverviewMetricsCard {
  id: string;
  label: string;
  value: string | number;
  changePercent?: number;
  changeDirection?: 'up' | 'down' | 'neutral';
  statusTag?: SystemHealthStatus;
  iconName: string;
}
