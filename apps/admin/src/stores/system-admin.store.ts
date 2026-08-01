import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { adminSystemService } from '../services/admin-system.service';
import {
  SettingsSectionKey,
  GeneralSettings,
  SecuritySettings,
  AIProviderConfig,
  FeatureFlag,
  IntegrationConfig,
  ApiKeyItem,
  CreateApiKeyDto,
  AuditLogEntry,
  MaintenanceConfig,
  StorageTelemetry,
  EmailTelemetry,
  PlatformAboutInfo,
} from '../features/system/models/system-admin.model';

export const useSystemAdminStore = defineStore('systemAdmin', () => {
  // State
  const activeSectionKey = ref<SettingsSectionKey>('general');
  const generalSettings = ref<GeneralSettings | null>(null);
  const securitySettings = ref<SecuritySettings | null>(null);
  const aiProviders = ref<AIProviderConfig[]>([]);
  const featureFlags = ref<FeatureFlag[]>([]);
  const integrations = ref<IntegrationConfig[]>([]);
  const apiKeys = ref<ApiKeyItem[]>([]);
  const auditLogs = ref<AuditLogEntry[]>([]);
  const maintenanceConfig = ref<MaintenanceConfig | null>(null);
  const storageTelemetry = ref<StorageTelemetry | null>(null);
  const emailTelemetry = ref<EmailTelemetry | null>(null);
  const platformAbout = ref<PlatformAboutInfo | null>(null);

  const isLoading = ref<boolean>(false);
  const isSaving = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Getters
  const activeFeatureFlagsCount = computed(() => featureFlags.value.filter((f) => f.isEnabled).length);
  const activeAIProvidersCount = computed(() => aiProviders.value.filter((p) => p.isEnabled).length);
  const defaultAIProvider = computed(() => aiProviders.value.find((p) => p.isDefault) || null);
  const activeApiKeysCount = computed(() => apiKeys.value.filter((k) => !k.isRevoked).length);

  // Actions
  async function fetchAllSystemState(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const [
        genRes,
        secRes,
        aiRes,
        flagsRes,
        integRes,
        keysRes,
        auditRes,
        maintRes,
        storageRes,
        emailRes,
        aboutRes,
      ] = await Promise.all([
        adminSystemService.getGeneralSettings(),
        adminSystemService.getSecuritySettings(),
        adminSystemService.getAIProviders(),
        adminSystemService.getFeatureFlags(),
        adminSystemService.getIntegrations(),
        adminSystemService.getApiKeys(),
        adminSystemService.getAuditLogs(),
        adminSystemService.getMaintenanceConfig(),
        adminSystemService.getStorageTelemetry(),
        adminSystemService.getEmailTelemetry(),
        adminSystemService.getPlatformAbout(),
      ]);

      generalSettings.value = genRes;
      securitySettings.value = secRes;
      aiProviders.value = aiRes;
      featureFlags.value = flagsRes;
      integrations.value = integRes;
      apiKeys.value = keysRes;
      auditLogs.value = auditRes;
      maintenanceConfig.value = maintRes;
      storageTelemetry.value = storageRes;
      emailTelemetry.value = emailRes;
      platformAbout.value = aboutRes;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch platform administration settings.';
    } finally {
      isLoading.value = false;
    }
  }

  async function updateGeneralSettings(updates: Partial<GeneralSettings>): Promise<void> {
    isSaving.value = true;
    try {
      const updated = await adminSystemService.updateGeneralSettings(updates);
      generalSettings.value = updated;
    } finally {
      isSaving.value = false;
    }
  }

  async function updateSecuritySettings(updates: Partial<SecuritySettings>): Promise<void> {
    isSaving.value = true;
    try {
      const updated = await adminSystemService.updateSecuritySettings(updates);
      securitySettings.value = updated;
    } finally {
      isSaving.value = false;
    }
  }

  async function toggleFeatureFlag(id: string, isEnabled: boolean): Promise<void> {
    const flag = featureFlags.value.find((f) => f.id === id);
    if (!flag) return;
    flag.isEnabled = isEnabled;
    await adminSystemService.updateFeatureFlag(id, { isEnabled });
  }

  async function toggleAIProvider(id: string, isEnabled: boolean): Promise<void> {
    const prov = aiProviders.value.find((p) => p.id === id);
    if (!prov) return;
    prov.isEnabled = isEnabled;
    await adminSystemService.updateAIProvider(id, { isEnabled });
  }

  async function setDefaultAIProvider(id: string): Promise<void> {
    aiProviders.value.forEach((p) => {
      p.isDefault = p.id === id;
    });
    await adminSystemService.updateAIProvider(id, { isDefault: true });
  }

  async function createApiKey(dto: CreateApiKeyDto): Promise<string> {
    isSaving.value = true;
    try {
      const created = await adminSystemService.createApiKey(dto);
      apiKeys.value.unshift(created);
      return created.fullSecretKey;
    } finally {
      isSaving.value = false;
    }
  }

  async function revokeApiKey(id: string): Promise<void> {
    const key = apiKeys.value.find((k) => k.id === id);
    if (key) {
      key.isRevoked = true;
    }
    await adminSystemService.revokeApiKey(id);
  }

  async function updateMaintenanceConfig(updates: Partial<MaintenanceConfig>): Promise<void> {
    isSaving.value = true;
    try {
      const updated = await adminSystemService.updateMaintenanceConfig(updates);
      maintenanceConfig.value = updated;
    } finally {
      isSaving.value = false;
    }
  }

  async function sendTestEmail(recipient: string): Promise<{ success: boolean; message: string }> {
    return await adminSystemService.sendTestEmail(recipient);
  }

  async function testAIProvider(id: string): Promise<{ success: boolean; latencyMs: number; message: string }> {
    return await adminSystemService.testAIProviderConnection(id);
  }

  async function testIntegration(id: string): Promise<{ success: boolean; message: string }> {
    return await adminSystemService.testIntegration(id);
  }

  return {
    activeSectionKey,
    generalSettings,
    securitySettings,
    aiProviders,
    featureFlags,
    integrations,
    apiKeys,
    auditLogs,
    maintenanceConfig,
    storageTelemetry,
    emailTelemetry,
    platformAbout,
    isLoading,
    isSaving,
    error,
    activeFeatureFlagsCount,
    activeAIProvidersCount,
    defaultAIProvider,
    activeApiKeysCount,
    fetchAllSystemState,
    updateGeneralSettings,
    updateSecuritySettings,
    toggleFeatureFlag,
    toggleAIProvider,
    setDefaultAIProvider,
    createApiKey,
    revokeApiKey,
    updateMaintenanceConfig,
    sendTestEmail,
    testAIProvider,
    testIntegration,
  };
});
