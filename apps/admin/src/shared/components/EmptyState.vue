<template>
  <div class="empty-state">
    <div class="icon-wrapper">
      <slot name="icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      </slot>
    </div>
    <h3 class="empty-title">{{ title }}</h3>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <div v-if="$slots.action" class="action-container">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'No Data Available',
  description: 'There are no records matching your current filter criteria.',
});
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}
.icon-wrapper {
  color: var(--admin-text-muted);
  opacity: 0.6;
  margin-bottom: 1rem;
}
.empty-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0 0 0.5rem 0;
}
.empty-description {
  font-size: 0.875rem;
  color: var(--admin-text-secondary);
  max-width: 400px;
  margin: 0 0 1.5rem 0;
}
.action-container {
  display: flex;
  gap: 0.75rem;
}
</style>
