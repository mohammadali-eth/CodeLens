<template>
  <div class="global-search-placeholder" @click="handleOpenSearch" tabindex="0" role="button" aria-label="Global search">
    <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <span class="search-label">Search users, reviews, audit logs...</span>
    <kbd class="search-kbd">⌘K</kbd>
  </div>
</template>

<script setup lang="ts">
function handleOpenSearch() {
  // Global search trigger placeholder
}
</script>

<style scoped>
.global-search-placeholder {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  cursor: pointer;
  width: 280px;
  transition: all 0.15s ease;
}
.global-search-placeholder:hover {
  border-color: var(--admin-primary);
}
.search-icon {
  color: var(--admin-text-muted);
}
.search-label {
  font-size: 0.8125rem;
  color: var(--admin-text-muted);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.search-kbd {
  font-size: 0.6875rem;
  font-family: monospace;
  background: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: 4px;
  padding: 2px 5px;
  color: var(--admin-text-muted);
}
</style>
