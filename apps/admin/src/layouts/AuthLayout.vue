<template>
  <div class="auth-layout-shell">
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.auth-layout-shell {
  min-height: 100vh;
  width: 100vw;
  background-color: var(--admin-bg-app);
}
</style>
