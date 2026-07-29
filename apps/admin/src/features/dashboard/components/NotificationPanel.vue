<template>
  <div v-if="notifications.length > 0" class="notification-panel">
    <div class="panel-header">
      <div class="header-left">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <h3 class="panel-title">System Alerts & Notifications</h3>
      </div>
      <button class="btn-clear-all" @click="clearAll">Dismiss All</button>
    </div>

    <div class="notifications-list">
      <div
        v-for="item in notifications"
        :key="item.id"
        class="notification-item"
        :class="item.type"
      >
        <div class="item-icon">
          <svg v-if="item.type === 'critical'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <svg v-else-if="item.type === 'warning'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>

        <div class="item-body">
          <span class="item-title">{{ item.title }}</span>
          <p class="item-msg">{{ item.message }}</p>
        </div>

        <button class="btn-dismiss" @click="dismiss(item.id)" title="Dismiss">
          &times;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface SystemNotification {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  createdAt: string;
}

const notifications = ref<SystemNotification[]>([
  {
    id: 'n1',
    type: 'info',
    title: 'System Operational',
    message: 'All microservices & AI processing queues are functioning within normal operational bounds.',
    createdAt: new Date().toISOString(),
  },
]);

function dismiss(id: string) {
  notifications.value = notifications.value.filter((n) => n.id !== id);
}

function clearAll() {
  notifications.value = [];
}
</script>

<style scoped>
.notification-panel {
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--admin-text-primary);
}

.panel-title {
  font-size: 0.875rem;
  font-weight: 700;
  margin: 0;
}

.btn-clear-all {
  background: none;
  border: none;
  color: var(--admin-text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-clear-all:hover {
  color: var(--admin-primary);
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border-radius: var(--admin-radius-md);
  position: relative;
}

.notification-item.critical {
  background-color: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #ef4444;
}

.notification-item.warning {
  background-color: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: #f59e0b;
}

.notification-item.info {
  background-color: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.25);
  color: #3b82f6;
}

.item-icon {
  margin-top: 0.125rem;
}

.item-body {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
}

.item-title {
  font-size: 0.8125rem;
  font-weight: 700;
}

.item-msg {
  font-size: 0.75rem;
  color: var(--admin-text-secondary);
  margin: 0;
}

.btn-dismiss {
  background: none;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--admin-text-muted);
  cursor: pointer;
}

.btn-dismiss:hover {
  color: var(--admin-text-primary);
}
</style>
