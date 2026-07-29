<template>
  <div
    class="skeleton-loader"
    :class="[type, { pulse: animated }]"
    :style="{ width, height, borderRadius: radius }"
  ></div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'text' | 'avatar' | 'card' | 'table-row';
  width?: string;
  height?: string;
  radius?: string;
  animated?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  animated: true,
});
</script>

<style scoped>
.skeleton-loader {
  background-color: var(--admin-border-color);
  opacity: 0.6;
}
.skeleton-loader.text {
  height: 1rem;
  width: 100%;
  border-radius: 4px;
}
.skeleton-loader.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.skeleton-loader.card {
  height: 120px;
  width: 100%;
  border-radius: var(--admin-radius-md);
}
.skeleton-loader.table-row {
  height: 48px;
  width: 100%;
  border-radius: 4px;
}
.skeleton-loader.pulse {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
@keyframes skeleton-pulse {
  0% { opacity: 0.4; }
  50% { opacity: 0.8; }
  100% { opacity: 0.4; }
}
</style>
