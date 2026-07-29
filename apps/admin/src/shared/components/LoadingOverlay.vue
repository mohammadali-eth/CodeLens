<template>
  <div v-if="isVisible" class="loading-overlay" :class="{ fullscreen: fullScreen }">
    <div class="spinner-container">
      <div class="spinner-ring"></div>
      <span class="loading-text">{{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLoadingStore } from '../../stores/loading.store';

interface Props {
  fullScreen?: boolean;
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fullScreen: true,
});

const loadingStore = useLoadingStore();

const isVisible = computed(() => loadingStore.isLoading);
const message = computed(() => props.message || loadingStore.loadingMessage);
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.loading-overlay.fullscreen {
  position: fixed;
  z-index: 9999;
}
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: var(--admin-bg-surface);
  padding: 1.5rem 2rem;
  border-radius: var(--admin-radius-md);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--admin-border-color);
}
.spinner-ring {
  width: 32px;
  height: 32px;
  border: 3px solid var(--admin-border-color);
  border-top-color: var(--admin-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.loading-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--admin-text-primary);
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
