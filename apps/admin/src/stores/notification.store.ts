import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<ToastNotification[]>([]);

  function notify(toast: Omit<ToastNotification, 'id'>): string {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastNotification = {
      id,
      duration: 4000,
      ...toast,
    };

    notifications.value.push(newToast);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newToast.duration);
    }

    return id;
  }

  function removeNotification(id: string): void {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  }

  function clearNotifications(): void {
    notifications.value = [];
  }

  return {
    notifications,
    notify,
    removeNotification,
    clearNotifications,
  };
});
