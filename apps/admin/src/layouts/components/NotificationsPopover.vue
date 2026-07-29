<template>
  <div class="notifications-popover">
    <button class="icon-trigger" @click="isOpen = !isOpen" aria-label="View notifications">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      <span v-if="unreadCount > 0" class="badge-dot"></span>
    </button>

    <div v-if="isOpen" class="dropdown-panel animate-fade-in">
      <div class="panel-header">
        <h4 class="title">Notifications</h4>
        <span class="count-badge">{{ unreadCount }} new</span>
      </div>
      <div class="divider"></div>
      <div class="notifications-list">
        <div class="empty-state">No new system alerts</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);
const unreadCount = ref(0);
</script>

<style scoped>
.notifications-popover {
  position: relative;
}
.icon-trigger {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--admin-radius-md);
  color: var(--admin-text-secondary);
  transition: all 0.15s ease;
}
.icon-trigger:hover {
  background-color: var(--admin-bg-app);
  color: var(--admin-primary);
}
.badge-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
}
.dropdown-panel {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 300px;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 0.75rem 0;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem 0.5rem 1rem;
}
.title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}
.count-badge {
  font-size: 0.75rem;
  background-color: rgba(37, 99, 235, 0.1);
  color: var(--admin-primary);
  padding: 2px 6px;
  border-radius: 999px;
  font-weight: 600;
}
.divider {
  height: 1px;
  background-color: var(--admin-border-color);
  margin-bottom: 0.5rem;
}
.empty-state {
  padding: 1.5rem;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--admin-text-muted);
}
</style>
