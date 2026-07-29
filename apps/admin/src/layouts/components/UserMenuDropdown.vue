<template>
  <div class="user-menu" ref="menuRef">
    <button class="user-trigger" @click="isOpen = !isOpen" aria-haspopup="true" :aria-expanded="isOpen">
      <div class="avatar-circle">
        {{ userInitial }}
      </div>
      <span class="user-name">{{ userName }}</span>
      <span class="role-badge">{{ userRole }}</span>
    </button>

    <div v-if="isOpen" class="dropdown-panel animate-fade-in" role="menu">
      <div class="user-info-header">
        <p class="header-name">{{ userName }}</p>
        <p class="header-email">{{ userEmail }}</p>
      </div>
      <div class="divider"></div>
      <router-link to="/profile" class="menu-item" @click="isOpen = false">
        Profile Settings
      </router-link>
      <router-link to="/settings" class="menu-item" @click="isOpen = false">
        System Settings
      </router-link>
      <div class="divider"></div>
      <button class="menu-item logout-btn" @click="handleLogout">
        Sign Out
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';

const isOpen = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const userName = computed(() => {
  const u = authStore.currentUser;
  return u ? `${u.firstName} ${u.lastName}`.trim() : 'Admin User';
});

const userEmail = computed(() => authStore.currentUser?.email || 'admin@codelens.ai');
const userRole = computed(() => authStore.userRole || 'ADMIN');
const userInitial = computed(() => userName.value.charAt(0).toUpperCase());

function handleLogout() {
  isOpen.value = false;
  authStore.logout();
  router.push('/login');
}
</script>

<style scoped>
.user-menu {
  position: relative;
}
.user-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: var(--admin-radius-md);
  transition: background 0.15s ease;
}
.user-trigger:hover {
  background-color: var(--admin-bg-app);
}
.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--admin-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}
.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--admin-text-primary);
}
.role-badge {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: rgba(37, 99, 235, 0.1);
  color: var(--admin-primary);
}
.dropdown-panel {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 220px;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 0.5rem 0;
}
.user-info-header {
  padding: 0.5rem 1rem;
}
.header-name {
  margin: 0;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--admin-text-primary);
}
.header-email {
  margin: 0;
  font-size: 0.75rem;
  color: var(--admin-text-muted);
}
.divider {
  height: 1px;
  background-color: var(--admin-border-color);
  margin: 0.375rem 0;
}
.menu-item {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  background: none;
  border: none;
  color: var(--admin-text-secondary);
  font-size: 0.8125rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
}
.menu-item:hover {
  background-color: var(--admin-bg-app);
  color: var(--admin-primary);
}
.logout-btn {
  color: #ef4444;
}
.logout-btn:hover {
  background-color: #fef2f2;
  color: #dc2626;
}
</style>
