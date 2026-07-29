<template>
  <div class="queue-status-panel">
    <div class="panel-header">
      <div class="header-title-group">
        <h3 class="panel-title">Background Job Queue</h3>
        <p class="panel-subtitle">BullMQ worker queue & processing pipeline</p>
      </div>

      <div class="throughput-badge" title="Queue Throughput Rate">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline>
        </svg>
        <span>{{ status?.throughputPerMinute || 0 }} jobs/min</span>
      </div>
    </div>

    <!-- Job Counters Grid -->
    <div class="counters-grid">
      <div class="counter-card active">
        <span class="counter-value">{{ status?.activeJobs || 0 }}</span>
        <span class="counter-label">Active</span>
      </div>
      <div class="counter-card pending">
        <span class="counter-value">{{ status?.pendingJobs || 0 }}</span>
        <span class="counter-label">Pending</span>
      </div>
      <div class="counter-card completed">
        <span class="counter-value">{{ status?.completedJobs || 0 }}</span>
        <span class="counter-label">Completed</span>
      </div>
      <div class="counter-card failed">
        <span class="counter-value">{{ status?.failedJobs || 0 }}</span>
        <span class="counter-label">Failed</span>
      </div>
    </div>

    <!-- Multi-Segment Queue Status Progress Bar -->
    <div class="progress-section">
      <div class="progress-bar-container">
        <div
          class="bar-segment active"
          :style="{ width: `${getSegmentPercentage(status?.activeJobs)}%` }"
          title="Active Jobs"
        ></div>
        <div
          class="bar-segment pending"
          :style="{ width: `${getSegmentPercentage(status?.pendingJobs)}%` }"
          title="Pending Jobs"
        ></div>
        <div
          class="bar-segment completed"
          :style="{ width: `${getSegmentPercentage(status?.completedJobs)}%` }"
          title="Completed Jobs"
        ></div>
        <div
          class="bar-segment failed"
          :style="{ width: `${getSegmentPercentage(status?.failedJobs)}%` }"
          title="Failed Jobs"
        ></div>
      </div>
    </div>

    <!-- Processing Performance Footer -->
    <div class="panel-footer">
      <div class="metric-col">
        <span class="metric-label">Avg Processing Time</span>
        <span class="metric-val">{{ ((status?.averageProcessingTimeMs || 0) / 1000).toFixed(2) }}s</span>
      </div>
      <div class="metric-col">
        <span class="metric-label">Queue Health</span>
        <span class="metric-val healthy">Optimal</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QueueStatus } from '../../../models';

const props = defineProps<{
  status: QueueStatus | null;
}>();

function getSegmentPercentage(count?: number): number {
  if (!props.status || !count) return 0;
  const total =
    (props.status.activeJobs || 0) +
    (props.status.pendingJobs || 0) +
    (props.status.completedJobs || 0) +
    (props.status.failedJobs || 0);
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}
</script>

<style scoped>
.queue-status-panel {
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.panel-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0;
}

.panel-subtitle {
  font-size: 0.8125rem;
  color: var(--admin-text-muted);
  margin: 0.25rem 0 0 0;
}

.throughput-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  background-color: rgba(37, 99, 235, 0.12);
  color: #3b82f6;
  border-radius: var(--admin-radius-full);
  font-size: 0.75rem;
  font-weight: 700;
}

.counters-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.625rem;
}

.counter-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 0.375rem;
  background-color: var(--admin-bg-app);
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
}

.counter-value {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--admin-text-primary);
}

.counter-label {
  font-size: 0.6875rem;
  color: var(--admin-text-muted);
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 0.125rem;
}

.counter-card.active .counter-value { color: #3b82f6; }
.counter-card.pending .counter-value { color: #f59e0b; }
.counter-card.completed .counter-value { color: #10b981; }
.counter-card.failed .counter-value { color: #ef4444; }

.progress-section {
  width: 100%;
}

.progress-bar-container {
  display: flex;
  height: 8px;
  width: 100%;
  background-color: var(--admin-bg-app);
  border-radius: var(--admin-radius-full);
  overflow: hidden;
}

.bar-segment {
  height: 100%;
  transition: width 0.3s ease;
}

.bar-segment.active { background-color: #3b82f6; }
.bar-segment.pending { background-color: #f59e0b; }
.bar-segment.completed { background-color: #10b981; }
.bar-segment.failed { background-color: #ef4444; }

.panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--admin-border-color);
}

.metric-col {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.metric-label {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
}

.metric-val {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}

.metric-val.healthy {
  color: #10b981;
}
</style>
