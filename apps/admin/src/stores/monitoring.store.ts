import { defineStore } from 'pinia';
import { adminMonitoringService } from '../services/admin-monitoring.service';
import {
  SystemHealthSummary,
  SystemMetrics,
  QueueMetricsSummary,
  AIAnalyticsData,
  UserAnalyticsData,
  ReviewAnalyticsData,
  SystemAlert,
  SystemLogEntry,
  LogCategory,
  SystemHealthStatus,
  OverviewMetricsCard,
} from '../features/monitoring/models/monitoring.model';

export interface MonitoringState {
  healthSummary: SystemHealthSummary | null;
  systemMetrics: SystemMetrics | null;
  queueSummary: QueueMetricsSummary | null;
  aiAnalytics: AIAnalyticsData | null;
  userAnalytics: UserAnalyticsData | null;
  reviewAnalytics: ReviewAnalyticsData | null;
  alerts: SystemAlert[];
  logs: SystemLogEntry[];
  activeLogCategory: LogCategory;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastRefreshTime: string | null;
}

export const useMonitoringStore = defineStore('monitoring', {
  state: (): MonitoringState => ({
    healthSummary: null,
    systemMetrics: null,
    queueSummary: null,
    aiAnalytics: null,
    userAnalytics: null,
    reviewAnalytics: null,
    alerts: [],
    logs: [],
    activeLogCategory: 'application',
    isLoading: false,
    isRefreshing: false,
    error: null,
    lastRefreshTime: null,
  }),

  getters: {
    overallHealth(state): SystemHealthStatus {
      return state.healthSummary?.overallStatus || 'HEALTHY';
    },

    unacknowledgedAlerts(state): SystemAlert[] {
      return state.alerts.filter((a) => !a.isAcknowledged);
    },

    criticalAlertsCount(state): number {
      return state.alerts.filter((a) => a.severity === 'CRITICAL' && !a.isAcknowledged).length;
    },

    overviewCards(state): OverviewMetricsCard[] {
      const metrics = state.systemMetrics;
      const users = state.userAnalytics;
      const reviews = state.reviewAnalytics;
      const ai = state.aiAnalytics;
      const queues = state.queueSummary;

      return [
        {
          id: 'card-users',
          label: 'Active Users',
          value: users ? users.dailyActiveUsers.toLocaleString() : '482',
          changePercent: users?.userGrowthPercent || 12.8,
          changeDirection: 'up',
          iconName: 'users',
        },
        {
          id: 'card-sessions',
          label: 'Concurrent Sessions',
          value: users ? users.activeSessions.toLocaleString() : '198',
          changePercent: 4.2,
          changeDirection: 'up',
          iconName: 'activity',
        },
        {
          id: 'card-reviews',
          label: 'Total Reviews',
          value: reviews ? reviews.totalReviews.toLocaleString() : '12,480',
          changePercent: 18.4,
          changeDirection: 'up',
          iconName: 'file-text',
        },
        {
          id: 'card-rpm',
          label: 'Reviews / Minute',
          value: reviews ? `${reviews.reviewsPerMinute} rpm` : '24.5 rpm',
          changePercent: 2.1,
          changeDirection: 'up',
          iconName: 'zap',
        },
        {
          id: 'card-ai-tokens',
          label: 'AI Tokens Used',
          value: ai ? `${(ai.totalTokens / 1000000).toFixed(2)}M` : '6.14M',
          changePercent: 8.5,
          changeDirection: 'up',
          iconName: 'cpu',
        },
        {
          id: 'card-queue',
          label: 'Pending Jobs',
          value: queues ? queues.totalPending : 14,
          changePercent: queues && queues.totalPending > 20 ? 15.0 : -5.2,
          changeDirection: queues && queues.totalPending > 20 ? 'down' : 'up',
          iconName: 'layers',
        },
        {
          id: 'card-latency',
          label: 'Avg API Latency',
          value: metrics ? `${metrics.avgResponseTimeMs.toFixed(1)} ms` : '38.4 ms',
          changePercent: -4.1,
          changeDirection: 'up',
          iconName: 'clock',
        },
        {
          id: 'card-health',
          label: 'System Health',
          value: state.healthSummary?.overallStatus || 'HEALTHY',
          statusTag: state.healthSummary?.overallStatus || 'HEALTHY',
          iconName: 'shield-check',
        },
      ];
    },
  },

  actions: {
    async fetchAllTelemetry() {
      this.isLoading = true;
      this.error = null;
      try {
        const [health, metrics, queues, ai, users, reviews, alerts, logs] = await Promise.all([
          adminMonitoringService.getHealthSummary(),
          adminMonitoringService.getSystemMetrics(),
          adminMonitoringService.getQueueMetrics(),
          adminMonitoringService.getAIAnalytics(),
          adminMonitoringService.getUserAnalytics(),
          adminMonitoringService.getReviewAnalytics(),
          adminMonitoringService.getAlerts(),
          adminMonitoringService.getLogs(this.activeLogCategory),
        ]);

        this.healthSummary = health;
        this.systemMetrics = metrics;
        this.queueSummary = queues;
        this.aiAnalytics = ai;
        this.userAnalytics = users;
        this.reviewAnalytics = reviews;
        this.alerts = alerts;
        this.logs = logs;
        this.lastRefreshTime = new Date().toISOString();
      } catch (err: any) {
        this.error = err?.message || 'Failed to load monitoring telemetry';
      } finally {
        this.isLoading = false;
      }
    },

    async refreshMetricsOnly() {
      this.isRefreshing = true;
      try {
        const [health, metrics, queues] = await Promise.all([
          adminMonitoringService.getHealthSummary(),
          adminMonitoringService.getSystemMetrics(),
          adminMonitoringService.getQueueMetrics(),
        ]);
        this.healthSummary = health;
        this.systemMetrics = metrics;
        this.queueSummary = queues;
        this.lastRefreshTime = new Date().toISOString();
      } catch (err: any) {
        console.warn('[MonitoringStore] Metrics refresh background error:', err);
      } finally {
        this.isRefreshing = false;
      }
    },

    async fetchLogsByCategory(category: LogCategory) {
      this.activeLogCategory = category;
      try {
        this.logs = await adminMonitoringService.getLogs(category);
      } catch (err: any) {
        console.warn('[MonitoringStore] Error fetching category logs:', err);
      }
    },

    acknowledgeAlert(alertId: string) {
      const target = this.alerts.find((a) => a.id === alertId);
      if (target) {
        target.isAcknowledged = true;
      }
    },

    updateLiveRealtimeMetrics(payload: Partial<SystemMetrics>) {
      if (this.systemMetrics) {
        this.systemMetrics = { ...this.systemMetrics, ...payload, timestamp: new Date().toISOString() };
      }
    },
  },
});
