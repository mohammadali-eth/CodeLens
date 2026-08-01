import { describe, beforeEach, it, expect, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSystemAdminStore } from '../system-admin.store';
import { adminSystemService } from '../../services/admin-system.service';

vi.mock('../../services/admin-system.service', () => ({
  adminSystemService: {
    getGeneralSettings: vi.fn().mockResolvedValue({
      platformName: 'Test Platform',
      organizationName: 'Test Org',
      defaultTimeZone: 'UTC',
      defaultLanguage: 'en-US',
      primaryColorHex: '#3b82f6',
    }),
    getSecuritySettings: vi.fn().mockResolvedValue({
      minPasswordLength: 12,
      requireSpecialChar: true,
      requireNumbers: true,
      requireUppercase: true,
      sessionTimeoutMinutes: 60,
      maxLoginAttempts: 5,
      lockoutDurationMinutes: 15,
      jwtExpiration: '24h',
      allowedOrigins: ['http://localhost:5173'],
    }),
    getAIProviders: vi.fn().mockResolvedValue([
      {
        id: 'prov_gemini',
        providerName: 'Google Gemini Pro',
        providerKey: 'gemini',
        isEnabled: true,
        isDefault: true,
        status: 'HEALTHY',
        responseTimeMs: 800,
        availableModels: ['gemini-1.5-pro'],
        activeModel: 'gemini-1.5-pro',
        apiKeyMasked: 'AIzaSy••••',
        maxTokenLimit: 128000,
      },
    ]),
    getFeatureFlags: vi.fn().mockResolvedValue([
      {
        id: 'flag_1',
        name: 'Test Flag',
        key: 'testFlag',
        description: 'Test flag desc',
        isEnabled: true,
        environment: 'production',
        rolloutPercentage: 100,
        updatedAt: '2026-08-01T00:00:00.000Z',
        updatedBy: 'admin@codelens.ai',
      },
    ]),
    getIntegrations: vi.fn().mockResolvedValue([]),
    getApiKeys: vi.fn().mockResolvedValue([]),
    getAuditLogs: vi.fn().mockResolvedValue([]),
    getMaintenanceConfig: vi.fn().mockResolvedValue({
      isMaintenanceEnabled: false,
      message: 'Upgrading system',
      allowedIpAddresses: ['127.0.0.1'],
      allowedRoles: ['SUPER_ADMIN'],
    }),
    getStorageTelemetry: vi.fn().mockResolvedValue({
      provider: 'LOCAL_DISK',
      totalSpaceBytes: 500000000,
      usedSpaceBytes: 100000000,
      availableSpaceBytes: 400000000,
      usedPercentage: 20,
      maxFileUploadMb: 100,
      activeBucketsCount: 1,
    }),
    getEmailTelemetry: vi.fn().mockResolvedValue({
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUserMasked: 'test@gmail.com',
      smtpStatus: 'CONNECTED',
      lastEmailSentAt: null,
      queuePendingCount: 0,
      queueProcessedCount: 10,
    }),
    getPlatformAbout: vi.fn().mockResolvedValue({
      version: 'v1.4.0',
      buildHash: 'hash123',
      licenseType: 'Enterprise',
      licensedTo: 'Test Org',
      environment: 'production',
      nodeVersion: 'v22.0.0',
      uptimeSeconds: 1000,
    }),
    updateGeneralSettings: vi.fn().mockResolvedValue({
      platformName: 'Updated Platform',
      organizationName: 'Test Org',
      defaultTimeZone: 'UTC',
      defaultLanguage: 'en-US',
      primaryColorHex: '#3b82f6',
    }),
    updateFeatureFlag: vi.fn().mockResolvedValue({}),
    updateAIProvider: vi.fn().mockResolvedValue({}),
    createApiKey: vi.fn().mockResolvedValue({
      id: 'key_new',
      name: 'New Key',
      ownerName: 'Super Admin',
      ownerEmail: 'admin@codelens.ai',
      keyPrefix: 'cl_live_new',
      scopes: ['reviews.read'],
      createdAt: '2026-08-01T00:00:00.000Z',
      expiresAt: null,
      lastUsedAt: null,
      isRevoked: false,
      fullSecretKey: 'cl_live_secret123',
    }),
    revokeApiKey: vi.fn().mockResolvedValue({}),
    testAIProviderConnection: vi.fn().mockResolvedValue({ success: true, latencyMs: 340, message: 'Ping ok' }),
    sendTestEmail: vi.fn().mockResolvedValue({ success: true, message: 'Email sent' }),
  },
}));

describe('useSystemAdminStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with default state', () => {
    const store = useSystemAdminStore();
    expect(store.activeSectionKey).toBe('general');
    expect(store.generalSettings).toBeNull();
    expect(store.isLoading).toBe(false);
  });

  it('fetches all platform system state', async () => {
    const store = useSystemAdminStore();
    await store.fetchAllSystemState();

    expect(adminSystemService.getGeneralSettings).toHaveBeenCalled();
    expect(store.generalSettings?.platformName).toBe('Test Platform');
    expect(store.securitySettings?.minPasswordLength).toBe(12);
    expect(store.aiProviders.length).toBe(1);
    expect(store.featureFlags.length).toBe(1);
  });

  it('updates general settings', async () => {
    const store = useSystemAdminStore();
    await store.updateGeneralSettings({ platformName: 'Updated Platform' });

    expect(adminSystemService.updateGeneralSettings).toHaveBeenCalledWith({ platformName: 'Updated Platform' });
    expect(store.generalSettings?.platformName).toBe('Updated Platform');
  });

  it('toggles feature flags', async () => {
    const store = useSystemAdminStore();
    store.featureFlags = [
      {
        id: 'flag_1',
        name: 'Test Flag',
        key: 'testFlag',
        description: 'Desc',
        isEnabled: true,
        environment: 'production',
        rolloutPercentage: 100,
        updatedAt: '2026-08-01T00:00:00.000Z',
        updatedBy: 'admin@codelens.ai',
      },
    ];

    await store.toggleFeatureFlag('flag_1', false);
    expect(store.featureFlags[0].isEnabled).toBe(false);
    expect(adminSystemService.updateFeatureFlag).toHaveBeenCalledWith('flag_1', { isEnabled: false });
  });

  it('creates an API key', async () => {
    const store = useSystemAdminStore();
    const secret = await store.createApiKey({ name: 'New Key', ownerEmail: 'admin@codelens.ai', scopes: ['reviews.read'] });

    expect(secret).toBe('cl_live_secret123');
    expect(store.apiKeys.length).toBe(1);
  });
});
