<template>
  <div class="app-card" :class="{ 'has-hover': hoverable }">
    <div v-if="title || $slots.header || $slots.actions" class="card-header">
      <div class="header-titles">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
        <slot name="header" />
      </div>
      <div v-if="$slots.actions" class="header-actions">
        <slot name="actions" />
      </div>
    </div>

    <div class="card-body" :class="{ 'no-padding': noPadding }">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  subtitle?: string;
  hoverable?: boolean;
  noPadding?: boolean;
}

withDefaults(defineProps<Props>(), {
  hoverable: false,
  noPadding: false,
});
</script>

<style scoped>
.app-card {
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  box-shadow: var(--admin-shadow-sm);
  transition: all 0.15s ease;
  overflow: hidden;
}
.app-card.has-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--admin-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0;
}
.card-subtitle {
  font-size: 0.8125rem;
  color: var(--admin-text-secondary);
  margin: 0.25rem 0 0 0;
}
.card-body {
  padding: 1.5rem;
}
.card-body.no-padding {
  padding: 0;
}
.card-footer {
  padding: 1rem 1.5rem;
  background-color: var(--admin-bg-app);
  border-top: 1px solid var(--admin-border-color);
}
</style>
