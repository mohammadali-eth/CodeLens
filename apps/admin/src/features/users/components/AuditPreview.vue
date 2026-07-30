<template>
  <div class="audit-preview-container">
    <div v-if="logs.length === 0" class="empty-audit">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
      <span>No security or activity audit logs recorded for this account.</span>
    </div>

    <div v-else class="audit-timeline">
      <div v-for="item in logs" :key="item.id" class="timeline-item">
        <div class="timeline-dot" :class="getEventSeverityClass(item.action)"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="action-name">{{ item.action }}</span>
            <span class="action-time">{{ formatTime(item.createdAt) }}</span>
          </div>
          <p v-if="item.details" class="action-details">{{ item.details }}</p>
          <div class="action-meta">
            <span v-if="item.ipAddress">IP: {{ item.ipAddress }}</span>
            <span v-if="item.userAgent">• {{ item.userAgent }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserAuditLogItem } from '../../../models';

defineProps<{
  logs: UserAuditLogItem[];
}>();

function getEventSeverityClass(action: string): string {
  const a = action.toUpperCase();
  if (a.includes('DELETE') || a.includes('SUSPEND') || a.includes('FAILED')) return 'danger';
  if (a.includes('ROLE') || a.includes('PASSWORD') || a.includes('STATUS')) return 'warning';
  return 'info';
}

function formatTime(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<style scoped>
.audit-preview-container {
  width: 100%;
}

.empty-audit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  color: var(--admin-text-muted);
  font-size: 0.8125rem;
  text-align: center;
}

.audit-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
  padding-left: 1.25rem;
}

.audit-timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background-color: var(--admin-border-color);
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.timeline-dot {
  position: absolute;
  left: -1.25rem;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--admin-bg-surface);
}

.timeline-dot.info { background-color: #3b82f6; }
.timeline-dot.warning { background-color: #f59e0b; }
.timeline-dot.danger { background-color: #ef4444; }

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 0.75rem 1rem;
  width: 100%;
}

.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action-name {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}

.action-time {
  font-size: 0.71875rem;
  color: var(--admin-text-muted);
}

.action-details {
  font-size: 0.78125rem;
  color: var(--admin-text-secondary);
  margin: 0;
}

.action-meta {
  font-size: 0.6875rem;
  color: var(--admin-text-muted);
  font-family: monospace;
}
</style>
