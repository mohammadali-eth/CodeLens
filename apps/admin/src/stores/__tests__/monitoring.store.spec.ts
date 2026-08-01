import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useMonitoringStore } from '../monitoring.store';

vi.mock('../../services/admin-monitoring.service', () => ({
  adminMonitoringService: {
    getHealthSummary: vi.fn().mockResolvedValue({
      overallStatus: 'HEALTHY',
      healthyCount: 6,
      warningCount: 0,
      criticalCount: 0,
      offlineCount: 0,
      components: [],
      lastUpdated: new Date().toISOString(),
    }),
    getSystemMetrics: vi.fn().mockResolvedValue({
      cpuUsagePercent: 25.0,
      memoryUsedMb: 4000,
      memoryTotalMb: 16000,
      memoryUsagePercent: 25.0,
      diskUsedGb: 100,
      diskTotalGb: 500,
      diskUsagePercent: 20.0,
      networkRxKbps: 1000,
      networkTxKbps: 2000,
      activeConnections: 150,
      httpRequestsPerMin: 1200,
      avgResponseTimeMs: 30.0,
      errorRatePercent: 0.1,
      successRatePercent: 99.9,
      timestamp: new Date().toISOString(),
    }),
    getQueueMetrics: vi.fn().mockResolvedValue({
      totalPending: 5,
      totalActive: 2,
      totalCompleted: 1000,
      totalFailed: 2,
      totalDelayed: 0,
      totalDeadLetter: 0,
      updatedAt: new Date().toISOString(),
      queues: [],
    }),
    getAIAnalytics: vi.fn().mockResolvedValue({
      totalCalls: 5000,
      totalPromptTokens: 1000000,
      totalCompletionTokens: 500000,
      totalTokens: 1500000,
      totalCostUsd: 12.5,
      avgLatencyMs: 800,
      failureRatePercent: 0.2,
      providerDistribution: [],
      modelBreakdown: [],
      timeSeries: [],
    }),
    getUserAnalytics: vi.fn().mockResolvedValue({
      dailyActiveUsers: 300,
      monthlyActiveUsers: 2000,
      totalRegistrations: 2500,
      userGrowthPercent: 10.0,
      newUsersToday: 20,
      activeSessions: 100,
      dauTrend: [],
      registrationTrend: [],
    }),
    getReviewAnalytics: vi.fn().mockResolvedValue({
      totalReviews: 8000,
      reviewsPerMinute: 15.0,
      completedCount: 7900,
      failedCount: 100,
      avgQualityScore: 88.0,
      avgDurationMs: 1200,
      qualityTrend: [],
      volumeTrend: [],
      complexityTrend: [],
      languageDistribution: [],
    }),
    getAlerts: vi.fn().mockResolvedValue([
      {
        id: 'test-alt-1',
        severity: 'HIGH',
        title: 'High Response Latency',
        message: 'Latency exceeded threshold',
        component: 'AI Provider',
        source: 'Monitor',
        timestamp: new Date().toISOString(),
        isAcknowledged: false,
      },
    ]),
    getLogs: vi.fn().mockResolvedValue([]),
  },
}));

describe('useMonitoringStore Unit Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with default empty monitoring state', () => {
    const store = useMonitoringStore();
    expect(store.healthSummary).toBeNull();
    expect(store.systemMetrics).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(store.alerts.length).toBe(0);
  });

  it('fetches all telemetry successfully and updates overview cards getter', async () => {
    const store = useMonitoringStore();
    await store.fetchAllTelemetry();

    expect(store.healthSummary).not.toBeNull();
    expect(store.overallHealth).toBe('HEALTHY');
    expect(store.overviewCards.length).toBe(8);
    expect(store.alerts.length).toBe(1);
    expect(store.unacknowledgedAlerts.length).toBe(1);
  });

  it('acknowledges an unacknowledged alert correctly', async () => {
    const store = useMonitoringStore();
    await store.fetchAllTelemetry();

    expect(store.unacknowledgedAlerts.length).toBe(1);
    store.acknowledgeAlert('test-alt-1');
    expect(store.unacknowledgedAlerts.length).toBe(0);
  });

  it('updates live metrics via real-time WebSocket tick payload', async () => {
    const store = useMonitoringStore();
    await store.fetchAllTelemetry();

    store.updateLiveRealtimeMetrics({ cpuUsagePercent: 88.5, avgResponseTimeMs: 120.0 });
    expect(store.systemMetrics?.cpuUsagePercent).toBe(88.5);
    expect(store.systemMetrics?.avgResponseTimeMs).toBe(120.0);
  });
});
