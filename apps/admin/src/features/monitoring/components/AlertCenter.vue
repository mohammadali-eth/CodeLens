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
  background: var(--admin-bg-surface, #ffffff);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-radius-md, 10px);
  padding: 1.5rem;
  box-shadow: var(--admin-shadow-sm);
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
  color: var(--admin-text-primary, #0f172a);
  margin: 0;
}

.header-subtitle {
  font-size: 0.85rem;
  color: var(--admin-text-muted, #64748b);
}

.active-count-badge {
  background: rgba(239, 68, 68, 0.15);
  color: var(--admin-danger, #ef4444);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.alert-card {
  background: var(--admin-bg-surface-hover, #f8fafc);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-left: 4px solid var(--admin-primary, #2563eb);
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
    border-left-color: var(--admin-danger, #ef4444);
    background: rgba(239, 68, 68, 0.05);
    .severity-tag { background: rgba(239, 68, 68, 0.2); color: var(--admin-danger, #ef4444); }
  }

  &.alert-high {
    border-left-color: var(--admin-warning, #f59e0b);
    background: rgba(245, 158, 11, 0.05);
    .severity-tag { background: rgba(245, 158, 11, 0.2); color: var(--admin-warning, #f59e0b); }
  }

  &.alert-medium {
    border-left-color: var(--admin-primary, #2563eb);
    .severity-tag { background: var(--admin-primary-glow, rgba(37, 99, 235, 0.2)); color: var(--admin-primary, #2563eb); }
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
  color: var(--admin-text-primary, #0f172a);
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
  color: var(--admin-text-secondary, #334155);
  margin: 0;
}

.alert-meta {
  display: flex;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--admin-text-muted, #64748b);
}

.ack-btn {
  background: var(--admin-bg-surface, #ffffff);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  color: var(--admin-text-primary, #0f172a);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: var(--admin-primary-glow, rgba(37, 99, 235, 0.1));
    border-color: var(--admin-primary, #2563eb);
    color: var(--admin-primary, #2563eb);
  }
}

.ack-status {
  font-size: 0.78rem;
  color: var(--admin-success, #10b981);
  font-weight: 600;
}

.skeleton-alerts {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;

  .alert-skeleton {
    height: 75px;
    background: var(--admin-bg-surface-hover, #f8fafc);
    border-radius: 8px;
  }
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--admin-text-muted, #64748b);
  font-size: 0.88rem;
}
</style>
