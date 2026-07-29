<template>
  <div class="toast-container" aria-live="polite">
    <transition-group name="toast-list">
      <div
        v-for="toast in notificationStore.notifications"
        :key="toast.id"
        class="toast-card"
        :class="toast.type"
      >
        <div class="toast-content">
          <h4 class="toast-title">{{ toast.title }}</h4>
          <p v-if="toast.message" class="toast-message">{{ toast.message }}</p>
        </div>
        <button class="toast-close" @click="notificationStore.removeNotification(toast.id)" aria-label="Close notification">
          &times;
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '../../stores/notification.store';

const notificationStore = useNotificationStore();
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 10000;
  max-width: 360px;
  width: 100%;
}
.toast-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

}
.toast-card.success { border-left: 4px solid #10b981; }
.toast-card.error { border-left: 4px solid #ef4444; }
.toast-card.warning { border-left: 4px solid #f59e0b; }
.toast-card.info { border-left: 4px solid var(--admin-primary); }

.toast-content {
  flex: 1;
}
.toast-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}
.toast-message {
  margin: 0.25rem 0 0 0;
  font-size: 0.8125rem;
  color: var(--admin-text-secondary);
}
.toast-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--admin-text-muted);
  cursor: pointer;
  padding: 0 0 0 0.5rem;
}
.toast-close:hover {
  color: var(--admin-text-primary);
}
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.2s ease;
}
.toast-list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
