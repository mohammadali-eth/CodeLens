<template>
  <span class="permission-badge">
    {{ permission }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  permission: string;
}

defineProps<Props>();
</script>

<style scoped>
.permission-badge {
  font-size: 0.6875rem;
  font-family: monospace;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  color: var(--admin-text-secondary);
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}
</style>
