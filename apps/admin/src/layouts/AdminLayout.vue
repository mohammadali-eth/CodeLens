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
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from './components/AdminSidebar.vue';
import AdminHeader from './components/AdminHeader.vue';
import AdminFooter from './components/AdminFooter.vue';
import LoadingOverlay from '../shared/components/LoadingOverlay.vue';
import Toast from '../shared/components/Toast.vue';
</script>

<style scoped>
.admin-layout-shell {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--admin-bg-app);
}
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
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
