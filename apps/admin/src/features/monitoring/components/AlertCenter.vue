<script setup lang="ts">
import { SystemAlert, AlertSeverity } from '../models/monitoring.model';

defineProps<{
  alerts: SystemAlert[];
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'acknowledge', id: string): void;
}>();

const severityClass = (severity: AlertSeverity) => {
  switch (severity) {
    case 'CRITICAL':
      return 'alert-critical';
    case 'HIGH':
      return 'alert-high';
    case 'MEDIUM':
      return 'alert-medium';
    default:
      return 'alert-info';
  }
};
</script>

<template>
  <div class="alert-center-panel">
    <div class="panel-header">
      <div class="header-left">
        <h3 class="panel-title">System Alert & Security Center</h3>
        <span class="header-subtitle">Real-time critical system warnings, AI provider degradation, and queue overflow alerts</span>
      </div>
      <span class="active-count-badge">
        {{ alerts.filter(a => !a.isAcknowledged).length }} Unacknowledged
      </span>
    </div>

    <div v-if="isLoading" class="skeleton-alerts">
      <div v-for="i in 2" :key="i" class="alert-skeleton"></div>
    </div>

    <div v-else-if="alerts.length === 0" class="empty-state">
      <p>✅ All systems operating smoothly. No active alerts.</p>
    </div>

    <div v-else class="alerts-list">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="alert-card"
        :class="[severityClass(alert.severity), { 'is-ack': alert.isAcknowledged }]"
      >
        <div class="alert-left">
          <div class="severity-icon-box">
            <span v-if="alert.severity === 'CRITICAL'">🚨</span>
            <span v-else-if="alert.severity === 'HIGH'">⚠️</span>
            <span v-else-if="alert.severity === 'MEDIUM'">⚡</span>
            <span v-else>ℹ️</span>
          </div>

          <div class="alert-body">
            <div class="alert-title-row">
              <span class="alert-title">{{ alert.title }}</span>
              <span class="severity-tag">{{ alert.severity }}</span>
            </div>
            <p class="alert-msg">{{ alert.message }}</p>
            <div class="alert-meta">
              <span>Component: {{ alert.component }}</span>
              <span>•</span>
              <span>Time: {{ new Date(alert.timestamp).toLocaleTimeString() }}</span>
            </div>
          </div>
        </div>

        <div class="alert-right">
          <button
            v-if="!alert.isAcknowledged"
            class="ack-btn"
            @click="emit('acknowledge', alert.id)"
          >
            Acknowledge
          </button>
          <span v-else class="ack-status">✓ Acknowledged</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.alert-center-panel {
  background: var(--admin-bg-surface, #1e293b);
  border: 1px solid var(--admin-border-color, #334155);
  border-radius: 12px;
  padding: 1.5rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
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

.active-count-badge {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.alert-card {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid var(--admin-border-color, #334155);
  border-left: 4px solid #3b82f6;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  &.is-ack {
    opacity: 0.65;
  }

  &.alert-critical {
    border-left-color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
    .severity-tag { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
  }

  &.alert-high {
    border-left-color: #f59e0b;
    background: rgba(245, 158, 11, 0.05);
    .severity-tag { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
  }

  &.alert-medium {
    border-left-color: #3b82f6;
    .severity-tag { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
  }
}

.alert-left {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.severity-icon-box {
  font-size: 1.3rem;
}

.alert-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.alert-title-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.alert-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--admin-text-primary, #f8fafc);
}

.severity-tag {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.alert-msg {
  font-size: 0.84rem;
  color: var(--admin-text-secondary, #94a3b8);
  margin: 0;
}

.alert-meta {
  display: flex;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--admin-text-secondary, #94a3b8);
}

.ack-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--admin-border-color, #334155);
  color: var(--admin-text-primary, #f8fafc);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: #3b82f6;
  }
}

.ack-status {
  font-size: 0.78rem;
  color: #10b981;
  font-weight: 600;
}

.skeleton-alerts {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;

  .alert-skeleton {
    height: 75px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 8px;
  }
}
</style>
