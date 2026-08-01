<template>
  <header class="admin-header">
    <div class="header-left">
      <Breadcrumbs />
    </div>

    <div class="header-right">
      <GlobalSearchPlaceholder />

      <button class="theme-toggle-btn" @click="themeStore.toggleTheme" :aria-label="'Switch theme mode'">
        <svg v-if="themeStore.currentMode === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>

      <NotificationsPopover />
      <UserMenuDropdown />
    </div>
  </header>
</template>

<script setup lang="ts">
import Breadcrumbs from './Breadcrumbs.vue';
import GlobalSearchPlaceholder from './GlobalSearchPlaceholder.vue';
import NotificationsPopover from './NotificationsPopover.vue';
import UserMenuDropdown from './UserMenuDropdown.vue';
import { useThemeStore } from '../../stores/theme.store';

const themeStore = useThemeStore();
</script>

<style scoped>
.admin-header {
  height: 64px;
  background-color: var(--admin-bg-surface);
  border-bottom: 1px solid var(--admin-border-color);
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.theme-toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--admin-radius-md);
  color: var(--admin-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
.theme-toggle-btn:hover {
  background-color: var(--admin-bg-app);
  color: var(--admin-primary);
}

@media (max-width: 640px) {
  .admin-header {
    padding: 0 0.75rem;
  }
  .header-left, .header-right {
    gap: 0.5rem;
  }
}
</style>
