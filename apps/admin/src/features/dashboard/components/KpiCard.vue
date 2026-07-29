<template>
  <div class="kpi-card" :class="metric.variant || 'primary'">
    <div class="kpi-content">
      <div class="kpi-header">
        <span class="kpi-title">{{ metric.title }}</span>
        <div class="icon-wrapper" :class="metric.variant || 'primary'">
          <!-- Users Icon -->
          <svg v-if="metric.icon === 'users'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <!-- User Check Icon -->
          <svg v-else-if="metric.icon === 'user-check'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <polyline points="17 11 19 13 23 9"></polyline>
          </svg>
          <!-- Code Icon -->
          <svg v-else-if="metric.icon === 'code'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <!-- Award Icon -->
          <svg v-else-if="metric.icon === 'award'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
          <!-- Default Activity Icon -->
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
      </div>

      <div class="kpi-body">
        <div class="kpi-value">{{ metric.value }}</div>
        
        <div v-if="metric.changePercentage !== undefined" class="kpi-footer">
          <div class="trend-badge" :class="metric.trend || 'neutral'">
            <svg v-if="metric.trend === 'up'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            <svg v-else-if="metric.trend === 'down'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <span>{{ metric.changePercentage > 0 ? '+' : '' }}{{ metric.changePercentage }}%</span>
          </div>
          <span class="timeframe-label">{{ metric.timeframe }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KpiMetric } from '../../../models';

defineProps<{
  metric: KpiMetric;
}>();
</script>

<style scoped>
.kpi-card {
  position: relative;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1.25rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  overflow: hidden;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
}

.kpi-content {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--admin-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--admin-radius-md);
}

.icon-wrapper.primary {
  background-color: rgba(37, 99, 235, 0.12);
  color: #3b82f6;
}

.icon-wrapper.success {
  background-color: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.icon-wrapper.info {
  background-color: rgba(6, 182, 212, 0.12);
  color: #06b6d4;
}

.icon-wrapper.purple {
  background-color: rgba(139, 92, 246, 0.12);
  color: #8b5cf6;
}

.icon-wrapper.warning {
  background-color: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.kpi-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.kpi-value {
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--admin-text-primary);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.kpi-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trend-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1875rem 0.5rem;
  border-radius: var(--admin-radius-full);
  font-size: 0.75rem;
  font-weight: 700;
}

.trend-badge.up {
  background-color: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.trend-badge.down {
  background-color: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.trend-badge.neutral {
  background-color: rgba(107, 114, 128, 0.12);
  color: #9ca3af;
}

.timeframe-label {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
}
</style>
