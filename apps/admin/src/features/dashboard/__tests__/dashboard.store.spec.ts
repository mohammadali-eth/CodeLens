import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useDashboardStore } from '../../../stores/dashboard.store';
import { adminDashboardService } from '../../../services/admin-dashboard.service';

vi.mock('../../../services/admin-dashboard.service', () => ({
  adminDashboardService: {
    getAdminSummary: vi.fn(),
    getQualityTrend: vi.fn(),
    getLanguageStats: vi.fn(),
    getProviderUsage: vi.fn(),
    getRecentActivity: vi.fn(),
    getSystemHealth: vi.fn(),
    getQueueStatus: vi.fn(),
    getAIUsage: vi.fn(),
  },
}));

describe('useDashboardStore Unit Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with default null/empty state', () => {
    const store = useDashboardStore();
    expect(store.summary).toBeNull();
    expect(store.qualityTrend).toEqual([]);
    expect(store.languageStats).toEqual([]);
    expect(store.providerUsage).toEqual([]);
    expect(store.recentActivities).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should fetch and populate dashboard data via fetchDashboardData()', async () => {
    const mockSummary = {
      totalUsers: 150,
      activeUsers: 45,
      newRegistrationsThisMonth: 12,
      totalReviews: 890,
      reviewsToday: 15,
      globalAverageQualityScore: 88.5,
      mostActiveUser: null,
      mostPopularLanguage: 'TypeScript',
      mostUsedAIProvider: 'Google Gemini',
    };

    vi.mocked(adminDashboardService.getAdminSummary).mockResolvedValue(mockSummary);
    vi.mocked(adminDashboardService.getQualityTrend).mockResolvedValue([]);
    vi.mocked(adminDashboardService.getLanguageStats).mockResolvedValue([]);
    vi.mocked(adminDashboardService.getProviderUsage).mockResolvedValue([]);
    vi.mocked(adminDashboardService.getRecentActivity).mockResolvedValue([]);
    vi.mocked(adminDashboardService.getSystemHealth).mockResolvedValue({
      api: { name: 'API', status: 'HEALTHY', lastCheckedAt: '' },
      database: { name: 'DB', status: 'HEALTHY', lastCheckedAt: '' },
      redis: { name: 'Redis', status: 'HEALTHY', lastCheckedAt: '' },
      queue: { name: 'Queue', status: 'HEALTHY', lastCheckedAt: '' },
      aiProvider: { name: 'AI', status: 'HEALTHY', lastCheckedAt: '' },
      websocket: { name: 'WS', status: 'HEALTHY', lastCheckedAt: '' },
      overallStatus: 'HEALTHY',
    });
    vi.mocked(adminDashboardService.getQueueStatus).mockResolvedValue({
      activeJobs: 2,
      pendingJobs: 5,
      completedJobs: 100,
      failedJobs: 1,
      throughputPerMinute: 30,
      averageProcessingTimeMs: 1200,
    });
    vi.mocked(adminDashboardService.getAIUsage).mockResolvedValue([]);

    const store = useDashboardStore();
    await store.fetchDashboardData(true);

    expect(store.summary).toEqual(mockSummary);
    expect(store.kpiCards.length).toBe(4);
    expect(store.kpiCards[0].value).toBe('150');
    expect(store.kpiCards[2].value).toBe('890');
    expect(store.isLoading).toBe(false);
  });

  it('should reactively update queue status via updateQueueStatus() action', () => {
    const store = useDashboardStore();
    store.queueStatus = {
      activeJobs: 1,
      pendingJobs: 2,
      completedJobs: 50,
      failedJobs: 0,
      throughputPerMinute: 20,
      averageProcessingTimeMs: 1500,
    };

    store.updateQueueStatus({ activeJobs: 5, pendingJobs: 10 });
    expect(store.queueStatus.activeJobs).toBe(5);
    expect(store.queueStatus.pendingJobs).toBe(10);
    expect(store.totalQueueJobs).toBe(15);
  });

  it('should prepend real-time activity events via addRecentActivity()', () => {
    const store = useDashboardStore();
    const newActivity = {
      id: 'act-1',
      action: 'User Registered',
      details: 'New user joined platform',
      createdAt: new Date().toISOString(),
    };

    store.addRecentActivity(newActivity);
    expect(store.recentActivities.length).toBe(1);
    expect(store.recentActivities[0].id).toBe('act-1');
  });
});
