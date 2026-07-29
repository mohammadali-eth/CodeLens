<template>
  <component :is="layoutComponent" />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AdminLayout from './layouts/AdminLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';
import { themeService } from './core/services/theme.service';

const route = useRoute();

onMounted(() => {
  themeService.initTheme();
});

const layoutComponent = computed(() => {
  return route.meta.layout === 'auth' ? AuthLayout : AdminLayout;
});
</script>

<style>
@import './styles/main.scss';
</style>
