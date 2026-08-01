<script setup lang="ts">
import { QueueMetricsSummary } from '../models/monitoring.model';

defineProps<{
  queueSummary: QueueMetricsSummary | null;
  isLoading?: boolean;
}>();
</script>

<template>
  <div class="queue-monitor-panel">
    <div class="panel-header">
      <div class="header-left">
        <h3 class="panel-title">BullMQ Worker Queue Telemetry</h3>
        <span class="header-subtitle">Background job queue health, worker concurrency, and dead-letter queues</span>
      </div>

      <div v-if="queueSummary" class="header-badges">
        <span class="dlq-badge" :class="{ 'has-failed': queueSummary.totalFailed > 0 }">
          Failed Jobs: {{ queueSummary.totalFailed }}
        </span>
        <span class="dlq-badge dead-letter" :class="{ 'has-dead-letter': queueSummary.totalDeadLetter > 0 }">
          Dead Letter Queue: {{ queueSummary.totalDeadLetter }}
        </span>
      </div>
    </div>

    <div v-if="isLoading" class="skeleton-queue-list">
      <div v-for="i in 3" :key="i" class="queue-skeleton"></div>
    </div>

    <div v-else-if="!queueSummary || queueSummary.queues.length === 0" class="empty-state">
      <p>No active BullMQ background queues detected.</p>
    </div>

    <div v-else class="queues-container">
      <div v-for="q in queueSummary.queues" :key="q.queueName" class="queue-row-card">
        <div class="queue-name-section">
          <div class="queue-title-box">
            <span class="queue-icon">⚙️</span>
            <span class="queue-name">{{ q.queueName }}</span>
          </div>
          <span class="throughput-label">
            ⚡ {{ q.workerThroughputPerSec }} jobs/sec | avg {{ q.avgProcessingTimeMs }}ms
          </span>
        </div>

        <div class="queue-metrics-pills">
          <div class="metric-pill pending">
            <span class="pill-label">Pending</span>
            <span class="pill-value">{{ q.pendingJobs }}</span>
          </div>

          <div class="metric-pill active">
            <span class="pill-label">Active</span>
            <span class="pill-value">{{ q.activeJobs }}</span>
          </div>

          <div class="metric-pill completed">
            <span class="pill-label">Completed</span>
            <span class="pill-value">{{ q.completedJobs.toLocaleString() }}</span>
          </div>

          <div class="metric-pill failed" :class="{ 'has-errors': q.failedJobs > 0 }">
            <span class="pill-label">Failed</span>
            <span class="pill-value">{{ q.failedJobs }}</span>
          </div>

          <div class="metric-pill delayed">
            <span class="pill-label">Delayed</span>
            <span class="pill-value">{{ q.delayedJobs }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.queue-monitor-panel {
  background: var(--admin-bg-surface, #1e293b);
  border: 1px solid var(--admin-border-color, #334155);
  border-radius: 12px;
  padding: 1.5rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.panel-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--admin-text-primary, #f8fafc);
  margin: 0;
}

.header-subtitle {
  font-size: 0.85rem;
  color: var(--admin-text-secondary, #94a3b8);
}

.header-badges {
  display: flex;
  gap: 0.6rem;
}

.dlq-badge {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--admin-text-secondary, #94a3b8);

  &.has-failed {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
  }

  &.dead-letter.has-dead-letter {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }
}

.queues-container {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.queue-row-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid var(--admin-border-color, #334155);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.queue-name-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.queue-title-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.queue-icon {
  font-size: 1.1rem;
}

.queue-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--admin-text-primary, #f8fafc);
  text-transform: capitalize;
}

.throughput-label {
  font-size: 0.78rem;
  color: var(--admin-text-secondary, #94a3b8);
}

.queue-metrics-pills {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.metric-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.05);

  .pill-label {
    font-size: 0.7rem;
    color: var(--admin-text-secondary, #94a3b8);
    text-transform: uppercase;
  }

  .pill-value {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--admin-text-primary, #f8fafc);
  }

  &.pending .pill-value { color: #3b82f6; }
  &.active .pill-value { color: #10b981; }
  &.failed.has-errors {
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.3);
    .pill-value { color: #ef4444; }
  }
}

.skeleton-queue-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;

  .queue-skeleton {
    height: 70px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 10px;
  }
}
</style>
