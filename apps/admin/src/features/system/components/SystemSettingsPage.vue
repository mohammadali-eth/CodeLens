<script setup lang="ts">
import { onMounted } from 'vue';
import { useSystemAdminStore } from '../../../stores/system-admin.store';
import SettingsSidebar from './SettingsSidebar.vue';
import SettingsSection from './SettingsSection.vue';
import { SettingsSectionKey } from '../models/system-admin.model';
import { useSystemAdminRealtime } from '../composables/useSystemAdminRealtime';

const store = useSystemAdminStore();
useSystemAdminRealtime();

onMounted(() => {
  store.fetchAllSystemState();
});

const handleSelectSection = (key: SettingsSectionKey) => {
  store.activeSectionKey = key;
};
</script>

<template>
  <div class="system-settings-page">
    <div class="page-header">
      <div class="header-titles">
        <h2 class="main-title">System Administration & Platform Configuration</h2>
        <span class="main-subtitle">Manage platform parameters, security policies, AI providers, feature flags, API keys, and maintenance.</span>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="store.error" class="error-banner">
      <span>⚠️ {{ store.error }}</span>
      <button class="close-btn" @click="store.error = null">✕</button>
    </div>

    <!-- Main Settings Shell -->
    <div class="settings-layout-shell">
      <SettingsSidebar
        :active-key="store.activeSectionKey"
        :feature-flags-count="store.activeFeatureFlagsCount"
        :ai-providers-count="store.activeAIProvidersCount"
        :api-keys-count="store.activeApiKeysCount"
        @select="handleSelectSection"
      />

      <SettingsSection :section-key="store.activeSectionKey" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.system-settings-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--admin-text-primary, #0f172a);
  margin: 0;
  letter-spacing: -0.02em;
}

.main-subtitle {
  font-size: 0.85rem;
  color: var(--admin-text-muted, #64748b);
}

.error-banner {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: var(--admin-danger, #ef4444);
  padding: 0.75rem 1rem;
  border-radius: var(--admin-radius-sm, 6px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .close-btn { background: transparent; border: none; font-weight: 700; cursor: pointer; color: var(--admin-danger, #ef4444); }
}

.settings-layout-shell {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;

  @media (max-width: 900px) {
    flex-direction: column;
  }
}
</style>
