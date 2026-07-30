<template>
  <div class="metrics-widget">
    <!-- Top Header Bar with Live Socket Status -->
    <div class="widget-header">
      <div class="title-group">
        <h3 class="widget-title">Review Management & AI Analysis Telemetry</h3>
        <span class="widget-subtitle">Real-time code review pipeline metrics</span>
      </div>

      <div class="connection-status" :class="{ online: isConnected }">
        <span class="status-dot"></span>
        <span class="status-text">{{ isConnected ? 'LIVE WEBSOCKET' : 'CONNECTING' }}</span>
        <span v-if="lastEventTime" class="event-time">• Updated {{ lastEventTime }}</span>
      </div>
    </div>

    <!-- Stat Metric Cards Grid -->
    <div class="stats-cards-grid">
      <!-- Total Reviews -->
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Total Code Reviews</span>
          <span class="stat-value">{{ stats.totalReviews.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Completed Reviews -->
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Completed Successfully</span>
          <span class="stat-value text-green">{{ stats.completedReviews.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Failed Reviews -->
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-red">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Failed Reviews</span>
          <span class="stat-value text-red">{{ stats.failedReviews.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Average Score -->
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-purple">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Avg Quality Score</span>
          <span class="stat-value text-purple">{{ stats.averageQualityScore }}/100</span>
        </div>
      </div>

      <!-- Avg Processing Latency -->
      <div class="stat-card">
        <div class="stat-icon-wrapper bg-amber">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Avg Execution Latency</span>
          <span class="stat-value text-amber">{{ (stats.averageProcessingTimeMs / 1000).toFixed(2) }}s</span>
        </div>
      </div>
    </div>

    <!-- Distribution Visualizers -->
    <div class="distributions-row">
      <!-- AI Provider Distribution -->
      <div class="dist-card">
        <h4 class="dist-title">AI Engine Provider Share</h4>
        <div class="dist-list">
          <div v-for="prov in stats.aiProviderDistribution" :key="prov.provider" class="dist-item">
            <div class="dist-meta">
              <span class="dist-name">{{ prov.provider }}</span>
              <span class="dist-val">{{ prov.count }} reviews ({{ prov.percentage }}%)</span>
            </div>
            <div class="dist-bar-track">
              <div class="dist-bar-fill bg-blue" :style="{ width: `${prov.percentage}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Language Distribution -->
      <div class="dist-card">
        <h4 class="dist-title">Programming Language Share</h4>
        <div class="dist-list">
          <div v-for="lang in stats.languageDistribution" :key="lang.language" class="dist-item">
            <div class="dist-meta">
              <span class="dist-name">{{ lang.language }}</span>
              <span class="dist-val">{{ lang.count }} reviews ({{ lang.percentage }}%)</span>
            </div>
            <div class="dist-bar-track">
              <div class="dist-bar-fill bg-emerald" :style="{ width: `${lang.percentage}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AdminReviewStats } from '../models/review.model';

const props = defineProps<{
  stats: AdminReviewStats;
  isConnected: boolean;
  lastEventTimestamp: string | null;
}>();

const lastEventTime = computed(() => {
  if (!props.lastEventTimestamp) return null;
  return new Date(props.lastEventTimestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
});
</script>

<style scoped>
.metrics-widget {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.widget-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0;
}

.widget-subtitle {
  font-size: 0.8125rem;
  color: var(--admin-text-muted);
}

.connection-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  background-color: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 700;

  &.online {
    background-color: rgba(16, 185, 129, 0.12);
    border-color: rgba(16, 185, 129, 0.3);
    color: #10b981;
  }
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
}

.online .status-dot {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.event-time {
  opacity: 0.85;
  font-weight: 500;
}

/* Stat Cards Grid */
.stats-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.stat-card {
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1.125rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--admin-shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--admin-shadow-md);
  }
}

.stat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--admin-radius-md);
  flex-shrink: 0;

  svg {
    width: 1.375rem;
    height: 1.375rem;
  }
}

.bg-blue { background-color: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.bg-green { background-color: rgba(16, 185, 129, 0.15); color: #10b981; }
.bg-red { background-color: rgba(239, 68, 68, 0.15); color: #ef4444; }
.bg-purple { background-color: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
.bg-amber { background-color: rgba(245, 158, 11, 0.15); color: #f59e0b; }

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.stat-value {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--admin-text-primary);
  line-height: 1.2;
}

.text-green { color: #10b981; }
.text-red { color: #ef4444; }
.text-purple { color: #8b5cf6; }
.text-amber { color: #f59e0b; }

/* Distribution Cards */
.distributions-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1rem;
}

.dist-card {
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1.125rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  box-shadow: var(--admin-shadow-sm);
}

.dist-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--admin-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.dist-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dist-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dist-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
}

.dist-name {
  font-weight: 700;
  color: var(--admin-text-primary);
}

.dist-val {
  color: var(--admin-text-secondary);
  font-size: 0.75rem;
  font-weight: 500;
}

.dist-bar-track {
  height: 0.5rem;
  background-color: var(--admin-bg-app);
  border-radius: 9999px;
  overflow: hidden;
  border: 1px solid var(--admin-border-color);
}

.dist-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.4s ease;
}

.bg-emerald { background-color: #10b981; }
</style>
