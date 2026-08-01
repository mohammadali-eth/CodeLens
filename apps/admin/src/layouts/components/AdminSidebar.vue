<template>
  <aside class="admin-sidebar" :class="{ 'is-collapsed': isCollapsed }">
    <div class="sidebar-brand">
      <div class="brand-logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      </div>
      <span v-if="!isCollapsed" class="brand-title">CodeLens <span class="badge">ADMIN</span></span>
    </div>

    <nav class="sidebar-nav" aria-label="Main Navigation">
      <div class="nav-section-label" v-if="!isCollapsed">MAIN MENU</div>
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-link"
        :class="{ active: currentPath === item.path }"
      >
        <span class="nav-icon" v-html="getIconSvg(item.id)"></span>
        <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button class="collapse-toggle" @click="isCollapsed = !isCollapsed" :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline v-if="isCollapsed" points="9 18 15 12 9 6"></polyline>
          <polyline v-else points="15 18 9 12 15 6"></polyline>
        </svg>
        <span v-if="!isCollapsed" class="toggle-text">Collapse Menu</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import { generateDynamicNavigation } from '../../core/auth/dynamic-navigation';

const route = useRoute();
const authStore = useAuthStore();
const isCollapsed = ref(false);

const currentPath = computed(() => route.path);

const navItems = computed(() => {
  return generateDynamicNavigation(authStore.userPermissions, authStore.userRole);
});

function getIconSvg(id: string): string {
  switch (id) {
    case 'dashboard':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`;
    case 'users':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;
    case 'reviews':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
    case 'reports':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
    case 'analytics':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`;
    case 'audit-logs':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
    case 'system':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`;
    case 'settings':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
    default:
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`;
  }
}
</script>

<style scoped>
.admin-sidebar {
  width: 240px;
  height: 100vh;
  background-color: var(--admin-bg-sidebar);
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: width 0.2s ease;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}
.admin-sidebar.is-collapsed {
  width: 64px;
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.brand-logo {
  width: 36px;
  height: 36px;
  background-color: var(--admin-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.brand-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
.badge {
  font-size: 0.625rem;
  background: rgba(37, 99, 235, 0.3);
  color: #60a5fa;
  padding: 2px 5px;
  border-radius: 4px;
  margin-left: 4px;
}
.sidebar-nav {
  flex: 1;
  padding: 1rem 0.5rem;
  overflow-y: auto;
}
.nav-section-label {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #64748b;
  padding: 0.5rem 0.75rem;
  letter-spacing: 0.05em;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  color: #94a3b8;
  text-decoration: none;
  border-radius: var(--admin-radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 2px;
  transition: all 0.15s ease;
}
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.06);
  color: #f8fafc;
}
.nav-link.active {
  background-color: var(--admin-primary);
  color: #ffffff;
}
.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sidebar-footer {
  padding: 0.75rem 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.collapse-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  border-radius: var(--admin-radius-md);
  font-size: 0.8125rem;
}
.collapse-toggle:hover {
  color: #f8fafc;
  background-color: rgba(255, 255, 255, 0.06);
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 64px !important;
  }
  .brand-title, .nav-label, .toggle-text, .nav-section-label {
    display: none !important;
  }
}
</style>
