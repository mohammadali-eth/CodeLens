<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useMonitoringStore } from '../../../stores/monitoring.store';
import { useMonitoringRealtime } from '../composables/useMonitoringRealtime';
import MetricsCard from './MetricsCard.vue';
import SystemHealthPanel from './SystemHealthPanel.vue';
import InfrastructurePanel from './InfrastructurePanel.vue';
import QueueMonitorPanel from './QueueMonitorPanel.vue';
import AIAnalyticsPanel from './AIAnalyticsPanel.vue';
import AlertCenter from './AlertCenter.vue';
import LogPreviewPanel from './LogPreviewPanel.vue';
import { LogCategory } from '../models/monitoring.model';

const store = useMonitoringStore();
useMonitoringRealtime();

const isAutoRefreshEnabled = ref<boolean>(true);
let autoRefreshTimer: ReturnType<typeof setInterval> | null = null;

const handleRefreshAll = async () => {
  await store.fetchAllTelemetry();
};

const handleAcknowledgeAlert = (id: string) => {
  store.acknowledgeAlert(id);
};

const handleSelectLogCategory = async (category: LogCategory) => {
  await store.fetchLogsByCategory(category);
};

onMounted(() => {
  store.fetchAllTelemetry();
  if (isAutoRefreshEnabled.value) {
    autoRefreshTimer = setInterval(() => {
      store.refreshMetricsOnly();
    }, 10000);
  }
});

onUnmounted(() => {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
  }
});
</script>

<template>
  <div class="monitoring-dashboard">
    <!-- Top Action Bar -->
    <div class="dashboard-header-bar">
      <div class="header-left">
        <h2 class="dashboard-title">Platform Analytics & System Monitoring</h2>
        <span class="last-updated" v-if="store.lastRefreshTime">
          Last Telemetry Pulse: {{ new Date(store.lastRefreshTime).toLocaleTimeString() }}
        </span>
      </div>

      <div class="header-right">
        <label class="auto-refresh-toggle">
          <input type="checkbox" v-model="isAutoRefreshEnabled" />
          <span class="toggle-label">Auto-Pulse (10s)</span>
        </label>

        <button class="primary-refresh-btn" :disabled="store.isLoading" @click="handleRefreshAll">
          <svg class="refresh-icon" :class="{ spinning: store.isLoading }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Refresh All Telemetry
        </button>
      </div>
    </div>

    <!-- Error Banner -->
    <div v-if="store.error" class="error-banner" role="alert">
      <span>⚠️ {{ store.error }}</span>
      <button class="dismiss-btn" @click="store.error = null">✕</button>
    </div>

    <!-- Platform Overview Metrics Grid -->
    <section class="overview-section" aria-label="Platform Overview Metrics">
      <div class="overview-grid">
        <MetricsCard
          v-for="card in store.overviewCards"
          :key="card.id"
          :card="card"
          :is-loading="store.isLoading"
        />
      </div>
    </section>

    <!-- System Health & Hardware Telemetry Grid -->
    <section class="monitoring-grid">
      <SystemHealthPanel
        :health-summary="store.healthSummary"
        :is-loading="store.isLoading"
        @refresh="store.refreshMetricsOnly()"
      />

      <InfrastructurePanel
        :metrics="store.systemMetrics"
        :is-loading="store.isLoading"
      />
    </section>

    <!-- BullMQ Worker Queue Telemetry -->
    <section class="monitoring-section">
      <QueueMonitorPanel
        :queue-summary="store.queueSummary"
        :is-loading="store.isLoading"
      />
    </section>

    <!-- AI Analytics Panel -->
    <section class="monitoring-section">
      <AIAnalyticsPanel
        :ai-analytics="store.aiAnalytics"
        :is-loading="store.isLoading"
      />
    </section>

    <!-- System Alerts & Console Logs Grid -->
    <section class="bottom-monitoring-grid">
      <AlertCenter
        :alerts="store.alerts"
        :is-loading="store.isLoading"
        @acknowledge="handleAcknowledgeAlert"
      />

      <LogPreviewPanel
        :logs="store.logs"
        :active-category="store.activeLogCategory"
        :is-loading="store.isLoading"
        @select-category="handleSelectLogCategory"
      />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.monitoring-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding: 1.5rem;
}

.dashboard-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--admin-text-primary, #f8fafc);
  margin: 0;
  letter-spacing: -0.02em;
}

.last-updated {
  font-size: 0.8rem;
  color: var(--admin-text-secondary, #94a3b8);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auto-refresh-toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: var(--admin-text-secondary, #94a3b8);
  cursor: pointer;

  input { accent-color: var(--admin-primary-color, #3b82f6); }
}

.primary-refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--admin-primary-color, #3b82f6);
  color: #ffffff;
  border: none;
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }

  .refresh-icon {
    width: 16px;
    height: 16px;
    &.spinning { animation: spin 1s linear infinite; }
  }
}

.error-banner {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .dismiss-btn {
    background: transparent;
    border: none;
    color: #ef4444;
    font-weight: 700;
    cursor: pointer;
  }
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.monitoring-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.bottom-monitoring-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.monitoring-section {
  width: 100%;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
