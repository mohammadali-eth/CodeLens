<template>
  <div class="admin-layout-shell">
    <AdminSidebar />
    <div class="main-wrapper">
      <AdminHeader />
      <main class="page-content" id="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <AdminFooter />
    </div>
    <LoadingOverlay />
    <Toast />
    <SessionTimeoutDialog />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import AdminSidebar from './components/AdminSidebar.vue';
import AdminHeader from './components/AdminHeader.vue';
import AdminFooter from './components/AdminFooter.vue';
import LoadingOverlay from '../shared/components/LoadingOverlay.vue';
import Toast from '../shared/components/Toast.vue';
import SessionTimeoutDialog from '../features/auth/components/SessionTimeoutDialog.vue';
import { sessionManager } from '../core/auth/session-manager';

onMounted(() => {
  sessionManager.startMonitoring();
});

onUnmounted(() => {
  sessionManager.stopMonitoring();
});
</script>

<style scoped>
.admin-layout-shell {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--admin-bg-app);
  color: var(--admin-text-primary);
  overflow: hidden;
}
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 0;
  overflow: hidden;
}
.page-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
