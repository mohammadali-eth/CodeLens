<template>
  <div class="system-health-panel">
    <div class="panel-header">
      <div class="header-left">
        <h3 class="panel-title">System Health & Infrastructure</h3>
        <p class="panel-subtitle">Real-time service telemetry & responsiveness</p>
      </div>

      <div class="overall-badge" :class="overallStatus.toLowerCase()">
        <span class="status-dot"></span>
        <span>{{ overallStatus }}</span>
      </div>
    </div>

    <div class="metrics-list">
      <div v-for="(metric, key) in healthItems" :key="key" class="health-item">
        <div class="item-left">
          <div class="status-indicator" :class="metric.status.toLowerCase()">
            <svg v-if="metric.status === 'HEALTHY'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg v-else-if="metric.status === 'WARNING'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div class="name-group">
            <span class="service-name">{{ metric.name }}</span>
            <span v-if="metric.message" class="service-msg">{{ metric.message }}</span>
          </div>
        </div>

        <div class="item-right">
          <span v-if="metric.latencyMs !== undefined" class="latency-badge">
            {{ metric.latencyMs }}ms
          </span>
          <span class="status-pill" :class="metric.status.toLowerCase()">
            {{ metric.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { SystemHealthOverview, HealthStatusLevel } from '../../../models';

const props = defineProps<{
  health: SystemHealthOverview | null;
}>();

const overallStatus = computed<HealthStatusLevel>(() => props.health?.overallStatus || 'HEALTHY');

const healthItems = computed(() => {
  if (!props.health) return [];
  return [
    props.health.api,
    props.health.database,
    props.health.redis,
    props.health.queue,
    props.health.aiProvider,
    props.health.websocket,
  ].filter(Boolean);
});
</script>

<style scoped>
.system-health-panel {
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.panel-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0;
}

.panel-subtitle {
  font-size: 0.8125rem;
  color: var(--admin-text-muted);
  margin: 0.25rem 0 0 0;
}

.overall-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: var(--admin-radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.overall-badge.healthy {
  background-color: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.overall-badge.warning {
  background-color: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.overall-badge.critical, .overall-badge.offline {
  background-color: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.metrics-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.health-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0.75rem;
  background-color: var(--admin-bg-app);
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.status-indicator.healthy {
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.status-indicator.warning {
  background-color: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.status-indicator.critical, .status-indicator.offline {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.name-group {
  display: flex;
  flex-direction: column;
}

.service-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--admin-text-primary);
}

.service-msg {
  font-size: 0.6875rem;
  color: var(--admin-text-muted);
}

.item-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.latency-badge {
  font-size: 0.75rem;
  font-family: var(--admin-font-mono, monospace);
  color: var(--admin-text-muted);
  background-color: var(--admin-bg-surface);
  padding: 0.125rem 0.375rem;
  border-radius: var(--admin-radius-sm);
}

.status-pill {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.125rem 0.375rem;
  border-radius: var(--admin-radius-sm);
}

.status-pill.healthy { color: #10b981; }
.status-pill.warning { color: #f59e0b; }
.status-pill.critical, .status-pill.offline { color: #ef4444; }
</style>
