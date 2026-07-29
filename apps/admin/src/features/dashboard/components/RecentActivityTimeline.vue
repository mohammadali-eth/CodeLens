<template>
  <div class="activity-timeline-panel">
    <div class="panel-header">
      <div class="header-title-group">
        <h3 class="panel-title">Recent Activity</h3>
        <p class="panel-subtitle">Real-time platform events & audit log stream</p>
      </div>
      <span class="activity-count">{{ activities.length }} events</span>
    </div>

    <!-- Empty State -->
    <div v-if="activities.length === 0" class="empty-state">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span>No recent activity recorded</span>
    </div>

    <!-- Timeline List -->
    <div v-else class="timeline-list">
      <div v-for="item in activities" :key="item.id" class="timeline-item">
        <div class="timeline-left">
          <div class="action-icon" :class="item.severity || 'info'">
            <svg v-if="item.action.toLowerCase().includes('user')" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <svg v-else-if="item.action.toLowerCase().includes('review')" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <svg v-else-if="item.action.toLowerCase().includes('chat')" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div class="connector-line"></div>
        </div>

        <div class="timeline-content">
          <div class="item-header">
            <span class="action-title">{{ item.action }}</span>
            <span class="time-ago">{{ formatRelativeTime(item.createdAt) }}</span>
          </div>
          <p v-if="item.details" class="item-details">{{ item.details }}</p>
          <span v-if="item.userEmail" class="item-user">{{ item.userEmail }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ActivityTimelineItem } from '../../../models';

defineProps<{
  activities: ActivityTimelineItem[];
}>();

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
</script>

<style scoped>
.activity-timeline-panel {
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

.activity-count {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--admin-text-muted);
  background-color: var(--admin-bg-app);
  padding: 0.25rem 0.625rem;
  border-radius: var(--admin-radius-full);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  color: var(--admin-text-muted);
  font-size: 0.875rem;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 360px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.timeline-item {
  display: flex;
  gap: 0.875rem;
  position: relative;
}

.timeline-left {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  z-index: 1;
}

.action-icon.info { background-color: rgba(37, 99, 235, 0.12); color: #3b82f6; }
.action-icon.success { background-color: rgba(16, 185, 129, 0.12); color: #10b981; }
.action-icon.warning { background-color: rgba(245, 158, 11, 0.12); color: #f59e0b; }
.action-icon.error { background-color: rgba(239, 68, 68, 0.12); color: #ef4444; }

.connector-line {
  width: 2px;
  height: 100%;
  background-color: var(--admin-border-color);
  margin-top: 0.25rem;
}

.timeline-item:last-child .connector-line {
  display: none;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--admin-text-primary);
}

.time-ago {
  font-size: 0.6875rem;
  color: var(--admin-text-muted);
}

.item-details {
  font-size: 0.75rem;
  color: var(--admin-text-secondary);
  margin: 0;
}

.item-user {
  font-size: 0.6875rem;
  color: var(--admin-primary);
  font-weight: 500;
}
</style>
