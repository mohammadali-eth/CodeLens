<script setup lang="ts">
import { SettingsSectionKey } from '../models/system-admin.model';
import { useSystemAdminStore } from '../../../stores/system-admin.store';
import GeneralSettingsPanel from './GeneralSettingsPanel.vue';
import SecuritySettingsPanel from './SecuritySettingsPanel.vue';
import AIProviderTable from './AIProviderTable.vue';
import FeatureFlagTable from './FeatureFlagTable.vue';
import IntegrationCard from './IntegrationCard.vue';
import ApiKeyTable from './ApiKeyTable.vue';
import AuditLogTable from './AuditLogTable.vue';
import MaintenancePanel from './MaintenancePanel.vue';
import StoragePanel from './StoragePanel.vue';
import EmailPanel from './EmailPanel.vue';
import AboutPanel from './AboutPanel.vue';

defineProps<{
  sectionKey: SettingsSectionKey;
}>();

const store = useSystemAdminStore();
</script>

<template>
  <div class="settings-section-container">
    <!-- Skeleton Loading -->
    <div v-if="store.isLoading" class="skeleton-box">
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-card"></div>
    </div>

    <!-- Active Panel Dynamic Rendering -->
    <template v-else>
      <GeneralSettingsPanel
        v-if="sectionKey === 'general'"
        :settings="store.generalSettings"
        :is-saving="store.isSaving"
        @save="store.updateGeneralSettings"
      />

      <SecuritySettingsPanel
        v-else-if="sectionKey === 'security'"
        :settings="store.securitySettings"
        :is-saving="store.isSaving"
        @save="store.updateSecuritySettings"
      />

      <AIProviderTable
        v-else-if="sectionKey === 'ai-providers'"
        :providers="store.aiProviders"
        :is-saving="store.isSaving"
        @toggle="store.toggleAIProvider"
        @set-default="store.setDefaultAIProvider"
        @test="store.testAIProvider"
      />

      <FeatureFlagTable
        v-else-if="sectionKey === 'feature-flags'"
        :flags="store.featureFlags"
        @toggle="store.toggleFeatureFlag"
      />

      <IntegrationCard
        v-else-if="sectionKey === 'integrations'"
        :integrations="store.integrations"
        @test="store.testIntegration"
      />

      <ApiKeyTable
        v-else-if="sectionKey === 'api-keys'"
        :api-keys="store.apiKeys"
        :is-saving="store.isSaving"
        @create="store.createApiKey"
        @revoke="store.revokeApiKey"
      />

      <AuditLogTable
        v-else-if="sectionKey === 'audit-logs'"
        :audit-logs="store.auditLogs"
      />

      <MaintenancePanel
        v-else-if="sectionKey === 'maintenance'"
        :config="store.maintenanceConfig"
        :is-saving="store.isSaving"
        @save="store.updateMaintenanceConfig"
      />

      <StoragePanel
        v-else-if="sectionKey === 'storage'"
        :storage="store.storageTelemetry"
      />

      <EmailPanel
        v-else-if="sectionKey === 'email'"
        :email="store.emailTelemetry"
        @send-test-email="store.sendTestEmail"
      />

      <AboutPanel
        v-else-if="sectionKey === 'about'"
        :about="store.platformAbout"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.settings-section-container {
  flex: 1;
  width: 100%;
}

.skeleton-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .skeleton-line {
    height: 24px;
    background: var(--admin-bg-surface-hover, #f8fafc);
    border-radius: 6px;
    width: 40%;
    &.short { width: 25%; }
  }

  .skeleton-card {
    height: 350px;
    background: var(--admin-bg-surface-hover, #f8fafc);
    border-radius: 10px;
  }
}
</style>
