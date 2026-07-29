<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="header-title-group">
        <h3 class="chart-title">{{ title }}</h3>
        <p v-if="subtitle" class="chart-subtitle">{{ subtitle }}</p>
      </div>
      <slot name="action"></slot>
    </div>

    <div class="chart-body">
      <!-- Area / Line Trend Chart Rendering -->
      <div v-if="type === 'trend'" class="trend-chart-container">
        <div class="trend-bars-wrapper">
          <div
            v-for="(point, idx) in trendData"
            :key="idx"
            class="trend-bar-col"
            :title="`${point.date}: ${point.averageScore}/100 (${point.reviewCount} reviews)`"
          >
            <div class="bar-fill-wrapper">
              <div
                class="bar-fill"
                :style="{ height: `${point.averageScore}%` }"
              ></div>
            </div>
            <span class="bar-label">{{ formatDate(point.date) }}</span>
          </div>
        </div>
      </div>

      <!-- Donut / Horizontal Bar Breakdown Chart Rendering -->
      <div v-else-if="type === 'bar-list'" class="bar-list-container">
        <div v-for="(item, idx) in listData" :key="idx" class="bar-list-item">
          <div class="item-header">
            <span class="item-label">{{ item.label }}</span>
            <span class="item-value">{{ item.value }} ({{ item.percentage }}%)</span>
          </div>
          <div class="item-bar-bg">
            <div
              class="item-bar-fill"
              :class="getBarVariantClass(idx)"
              :style="{ width: `${item.percentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QualityTrendPoint } from '../../../models';

interface ListItem {
  label: string;
  value: number;
  percentage: number;
}

withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    type: 'trend' | 'bar-list';
    trendData?: QualityTrendPoint[];
    listData?: ListItem[];
  }>(),
  {
    subtitle: '',
    trendData: () => [],
    listData: () => [],
  }
);

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function getBarVariantClass(idx: number): string {
  const variants = ['variant-primary', 'variant-success', 'variant-info', 'variant-purple', 'variant-warning'];
  return variants[idx % variants.length];
}
</script>

<style scoped>
.chart-card {
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.chart-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0;
}

.chart-subtitle {
  font-size: 0.8125rem;
  color: var(--admin-text-muted);
  margin: 0.25rem 0 0 0;
}

.chart-body {
  width: 100%;
}

.trend-chart-container {
  width: 100%;
  height: 220px;
  display: flex;
  align-items: flex-end;
}

.trend-bars-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  padding-top: 1rem;
}

.trend-bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  height: 100%;

}

.bar-fill-wrapper {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: var(--admin-radius-sm);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(180deg, var(--admin-primary) 0%, rgba(37, 99, 235, 0.3) 100%);
  border-radius: var(--admin-radius-sm) var(--admin-radius-sm) 0 0;
  transition: height 0.3s ease;
}

.trend-bar-col:hover .bar-fill {
  background: linear-gradient(180deg, #3b82f6 0%, rgba(59, 130, 246, 0.6) 100%);
}

.bar-label {
  font-size: 0.6875rem;
  color: var(--admin-text-muted);
}

.bar-list-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bar-list-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;
}

.item-label {
  font-weight: 600;
  color: var(--admin-text-primary);
}

.item-value {
  color: var(--admin-text-muted);
  font-size: 0.75rem;
}

.item-bar-bg {
  width: 100%;
  height: 8px;
  background-color: var(--admin-bg-app);
  border-radius: var(--admin-radius-full);
  overflow: hidden;
}

.item-bar-fill {
  height: 100%;
  border-radius: var(--admin-radius-full);
  transition: width 0.4s ease;
}

.variant-primary { background-color: var(--admin-primary); }
.variant-success { background-color: var(--admin-success); }
.variant-info { background-color: #06b6d4; }
.variant-purple { background-color: #8b5cf6; }
.variant-warning { background-color: #f59e0b; }
</style>
