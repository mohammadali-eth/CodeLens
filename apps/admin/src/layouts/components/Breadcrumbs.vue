<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item">
        <router-link to="/dashboard" class="breadcrumb-link">Home</router-link>
      </li>
      <li v-for="(item, index) in items" :key="index" class="breadcrumb-item">
        <span class="separator">/</span>
        <router-link v-if="item.path && index < items.length - 1" :to="item.path" class="breadcrumb-link">
          {{ item.title }}
        </router-link>
        <span v-else class="breadcrumb-current" aria-current="page">{{ item.title }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

interface BreadcrumbItem {
  title: string;
  path?: string;
}

const route = useRoute();

const items = computed<BreadcrumbItem[]>(() => {
  const matched = route.matched.filter((r) => r.meta && r.meta.title && r.path !== '/');
  return matched.map((r) => ({
    title: (r.meta.title as string) || 'Page',
    path: r.path,
  }));
});
</script>

<style scoped>
.breadcrumbs {
  font-size: 0.8125rem;
  color: var(--admin-text-muted);
}
.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.separator {
  color: var(--admin-text-muted);
  opacity: 0.5;
}
.breadcrumb-link {
  color: var(--admin-text-secondary);
  text-decoration: none;
  transition: color 0.15s ease;
}
.breadcrumb-link:hover {
  color: var(--admin-primary);
}
.breadcrumb-current {
  color: var(--admin-text-primary);
  font-weight: 600;
}
</style>
