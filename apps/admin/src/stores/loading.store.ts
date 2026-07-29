import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const manualLoadingCount = ref<number>(0);
  const loadingMessage = ref<string>('Loading...');

  const isLoading = computed(() => manualLoadingCount.value > 0);

  function showLoading(message: string = 'Loading...'): void {
    loadingMessage.value = message;
    manualLoadingCount.value++;
  }

  function hideLoading(): void {
    manualLoadingCount.value = Math.max(0, manualLoadingCount.value - 1);
  }

  return {
    manualLoadingCount,
    loadingMessage,
    isLoading,
    showLoading,
    hideLoading,
  };
});
