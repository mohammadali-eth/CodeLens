<template>
  <div class="error-state">
    <div class="icon-wrapper">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    </div>
    <h3 class="error-title">{{ title }}</h3>
    <p class="error-message">{{ message }}</p>
    <button v-if="showRetry" class="retry-btn" @click="$emit('retry')">
      Retry Request
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  message?: string;
  showRetry?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: 'Failed to Load Data',
  message: 'An unexpected network error occurred while communicating with the backend API.',
  showRetry: true,
});

defineEmits<{
  (e: 'retry'): void;
}>();
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  background-color: rgba(239, 68, 68, 0.04);
  border: 1px dashed rgba(239, 68, 68, 0.3);
  border-radius: var(--admin-radius-md);
}
.icon-wrapper {
  color: #ef4444;
  margin-bottom: 1rem;
}
.error-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0 0 0.5rem 0;
}
.error-message {
  font-size: 0.875rem;
  color: var(--admin-text-secondary);
  max-width: 440px;
  margin: 0 0 1.5rem 0;
}
.retry-btn {
  background-color: var(--admin-primary);
  color: #ffffff;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: var(--admin-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}
.retry-btn:hover {
  background-color: var(--admin-primary-hover);
}
</style>
