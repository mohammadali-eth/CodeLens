import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeSessions: number;
  pendingReviewsCount: number;
}

export const useAdminStore = defineStore('admin', () => {
  const systemHealth = ref<'healthy' | 'degraded' | 'down'>('healthy');
  const metrics = ref<SystemMetrics | null>(null);

  function setSystemHealth(status: 'healthy' | 'degraded' | 'down'): void {
    systemHealth.value = status;
  }

  function setMetrics(newMetrics: SystemMetrics): void {
    metrics.value = newMetrics;
  }

  return {
    systemHealth,
    metrics,
    setSystemHealth,
    setMetrics,
  };
});
