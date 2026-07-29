<template>
  <header class="dashboard-header">
    <div class="header-left">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <ol class="breadcrumb-list">
          <li class="breadcrumb-item">
            <router-link to="/dashboard" class="breadcrumb-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Home</span>
            </router-link>
          </li>
          <li class="breadcrumb-separator">/</li>
          <li class="breadcrumb-item active" aria-current="page">Platform Overview</li>
        </ol>
      </nav>
      
      <div class="title-group">
        <h1 class="page-title">Executive Dashboard</h1>
        <p class="page-subtitle">Real-time platform metrics, system health, and AI review activity overview</p>
      </div>
    </div>

    <div class="header-right">
      <!-- Last Refreshed Indicator -->
      <div v-if="lastFetchedText" class="last-updated">
        <span class="pulse-dot"></span>
        <span>Updated {{ lastFetchedText }}</span>
      </div>

      <!-- Timeframe Selector -->
      <div class="timeframe-selector">
        <button
          v-for="option in timeframeOptions"
          :key="option.value"
          class="timeframe-btn"
          :class="{ active: selectedTimeframe === option.value }"
          @click="selectTimeframe(option.value)"
        >
          {{ option.label }}
        </button>
      </div>

      <!-- Refresh Button -->
      <button
        class="btn-refresh"
        :disabled="isRefreshing || isLoading"
        @click="$emit('refresh')"
        title="Refresh Metrics"
      >
        <svg
          class="refresh-icon"
          :class="{ spinning: isRefreshing }"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
        <span>{{ isRefreshing ? 'Syncing...' : 'Refresh' }}</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  isLoading?: boolean;
  isRefreshing?: boolean;
  lastFetchedAt?: number | null;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
  (e: 'timeframe-change', value: string): void;
}>();

const selectedTimeframe = ref('30d');

const timeframeOptions = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
];

const lastFetchedText = computed(() => {
  if (!props.lastFetchedAt) return '';
  const secondsAgo = Math.floor((Date.now() - props.lastFetchedAt) / 1000);
  if (secondsAgo < 5) return 'just now';
  if (secondsAgo < 60) return `${secondsAgo}s ago`;
  const minutesAgo = Math.floor(secondsAgo / 60);
  return `${minutesAgo}m ago`;
});

function selectTimeframe(val: string) {
  selectedTimeframe.value = val;
  emit('timeframe-change', val);
}
</script>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--admin-border-color);
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.breadcrumbs {
  font-size: 0.8125rem;
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
  color: var(--admin-text-muted);
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--admin-text-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}

.breadcrumb-link:hover {
  color: var(--admin-primary);
}

.breadcrumb-separator {
  color: var(--admin-text-muted);
  opacity: 0.6;
}

.breadcrumb-item.active {
  color: var(--admin-text-primary);
  font-weight: 500;
}

.page-title {
  font-size: 1.625rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  letter-spacing: -0.02em;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--admin-text-muted);
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.last-updated {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--admin-text-muted);
  background-color: var(--admin-bg-surface);
  padding: 0.375rem 0.75rem;
  border-radius: var(--admin-radius-full);
  border: 1px solid var(--admin-border-color);
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--admin-success);
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.timeframe-selector {
  display: flex;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 0.1875rem;
}

.timeframe-btn {
  background: none;
  border: none;
  padding: 0.3125rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--admin-text-muted);
  border-radius: var(--admin-radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}

.timeframe-btn:hover {
  color: var(--admin-text-primary);
}

.timeframe-btn.active {
  background-color: var(--admin-primary);
  color: #ffffff;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  color: var(--admin-text-primary);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-refresh:hover:not(:disabled) {
  background-color: var(--admin-border-color);
  border-color: var(--admin-text-muted);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon.spinning {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
