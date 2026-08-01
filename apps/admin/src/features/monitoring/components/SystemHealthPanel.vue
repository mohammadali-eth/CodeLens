<script setup lang="ts">
import { computed, ref } from 'vue';
import { SystemHealthSummary, SystemHealthStatus } from '../models/monitoring.model';

const props = defineProps<{
  healthSummary: SystemHealthSummary | null;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const selectedStatusFilter = ref<string>('ALL');

const filteredComponents = computed(() => {
  if (!props.healthSummary) return [];
  if (selectedStatusFilter.value === 'ALL') return props.healthSummary.components;
  return props.healthSummary.components.filter((c) => c.status === selectedStatusFilter.value);
});

const statusBadgeClass = (status: SystemHealthStatus) => {
  switch (status) {
    case 'HEALTHY':
      return 'badge-healthy';
    case 'WARNING':
      return 'badge-warning';
    case 'CRITICAL':
      return 'badge-critical';
    case 'OFFLINE':
      return 'badge-offline';
    default:
      return '';
  }
};
</script>

<template>
  <div class="system-health-panel">
    <div class="panel-header">
      <div class="header-left">
        <h3 class="panel-title">System Infrastructure & Services Health</h3>
        <span class="header-subtitle">Real-time status of microservices, databases, and AI providers</span>
      </div>

      <div class="header-actions">
        <div class="status-filter-pills">
          <button
            class="pill-btn"
            :class="{ active: selectedStatusFilter === 'ALL' }"
            @click="selectedStatusFilter = 'ALL'"
          >
            All ({{ healthSummary?.components.length || 0 }})
          </button>

          <button
            class="pill-btn healthy"
            :class="{ active: selectedStatusFilter === 'HEALTHY' }"
            @click="selectedStatusFilter = 'HEALTHY'"
          >
            Healthy ({{ healthSummary?.healthyCount || 0 }})
          </button>

          <button
            class="pill-btn warning"
            :class="{ active: selectedStatusFilter === 'WARNING' }"
            @click="selectedStatusFilter = 'WARNING'"
          >
            Warning ({{ healthSummary?.warningCount || 0 }})
          </button>
        </div>

        <button class="refresh-btn" :disabled="isLoading" @click="emit('refresh')">
          <svg class="spin-icon" :class="{ spinning: isLoading }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="health-skeleton-grid">
      <div v-for="i in 6" :key="i" class="health-skeleton-card"></div>
    </div>

    <div v-else-if="filteredComponents.length === 0" class="empty-state">
      <p>No health components match the selected status filter.</p>
    </div>

    <div v-else class="components-grid">
      <div v-for="comp in filteredComponents" :key="comp.id" class="component-card">
        <div class="comp-top">
          <span class="comp-name">{{ comp.name }}</span>
          <span class="status-badge" :class="statusBadgeClass(comp.status)">
            <span class="status-dot"></span>
            {{ comp.status }}
          </span>
        </div>

        <div class="comp-middle">
          <span class="latency-label">Response Latency:</span>
          <span class="latency-value" :class="{ 'high-latency': comp.latencyMs > 1000 }">
            {{ comp.latencyMs }} ms
          </span>
        </div>

        <p class="comp-message" :title="comp.message">
          {{ comp.message || 'Service operating normally.' }}
        </p>

        <div class="comp-footer">
          <span class="category-tag">{{ comp.category }}</span>
          <span class="checked-time">Checked: {{ new Date(comp.lastChecked).toLocaleTimeString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.system-health-panel {
  background: var(--admin-bg-surface, #1e293b);
  border: 1px solid var(--admin-border-color, #334155);
  border-radius: 12px;
  padding: 1.5rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.panel-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--admin-text-primary, #f8fafc);
  margin: 0;
}

.header-subtitle {
  font-size: 0.85rem;
  color: var(--admin-text-secondary, #94a3b8);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-filter-pills {
  display: flex;
  background: rgba(15, 23, 42, 0.6);
  padding: 0.2rem;
  border-radius: 8px;

  .pill-btn {
    background: transparent;
    border: none;
    color: var(--admin-text-secondary, #94a3b8);
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &.active {
      background: var(--admin-primary-color, #3b82f6);
      color: #ffffff;
    }

    &.healthy.active { background: #10b981; }
    &.warning.active { background: #f59e0b; }
  }
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--admin-border-color, #334155);
  color: var(--admin-text-primary, #f8fafc);
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }

  .spin-icon {
    width: 14px;
    height: 14px;
    &.spinning { animation: spin 1s linear infinite; }
  }
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.component-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid var(--admin-border-color, #334155);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.comp-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comp-name {
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--admin-text-primary, #f8fafc);
}

.comp-middle {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;

  .latency-label { color: var(--admin-text-secondary, #94a3b8); }
  .latency-value { font-weight: 700; color: #10b981; }
  .latency-value.high-latency { color: #f59e0b; }
}

.comp-message {
  font-size: 0.78rem;
  color: var(--admin-text-secondary, #94a3b8);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.comp-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.2rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--admin-border-color, #334155);
  font-size: 0.72rem;

  .category-tag {
    background: rgba(59, 130, 246, 0.1);
    color: var(--admin-primary-color, #3b82f6);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    font-weight: 600;
  }

  .checked-time { color: var(--admin-text-secondary, #94a3b8); }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;

  .status-dot { width: 6px; height: 6px; border-radius: 50%; }

  &.badge-healthy { color: #10b981; background: rgba(16, 185, 129, 0.12); .status-dot { background: #10b981; } }
  &.badge-warning { color: #f59e0b; background: rgba(245, 158, 11, 0.12); .status-dot { background: #f59e0b; } }
  &.badge-critical { color: #ef4444; background: rgba(239, 68, 68, 0.12); .status-dot { background: #ef4444; } }
  &.badge-offline { color: #64748b; background: rgba(100, 116, 139, 0.12); .status-dot { background: #64748b; } }
}

.health-skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;

  .health-skeleton-card {
    height: 110px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 10px;
    animation: pulse 1.5s infinite;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 0.8; }
  100% { opacity: 0.4; }
}
</style>
