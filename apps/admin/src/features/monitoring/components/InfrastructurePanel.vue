<script setup lang="ts">
import { computed } from 'vue';
import { SystemMetrics } from '../models/monitoring.model';

const props = defineProps<{
  metrics: SystemMetrics | null;
  isLoading?: boolean;
}>();

const cpuUsagePercent = computed(() => props.metrics?.cpuUsagePercent || 0);
const memoryUsagePercent = computed(() => props.metrics?.memoryUsagePercent || 0);
const diskUsagePercent = computed(() => props.metrics?.diskUsagePercent || 0);

const getProgressColor = (percent: number) => {
  if (percent > 85) return 'var(--admin-danger, #ef4444)';
  if (percent > 70) return 'var(--admin-warning, #f59e0b)';
  return 'var(--admin-success, #10b981)';
};
</script>

<template>
  <div class="infrastructure-panel">
    <div class="panel-header">
      <h3 class="panel-title">Infrastructure Hardware Telemetry</h3>
      <span class="header-subtitle">Real-time Node CPU, RAM, SSD, and Network I/O metrics</span>
    </div>

    <div v-if="isLoading" class="skeleton-infra-grid">
      <div v-for="i in 4" :key="i" class="infra-skeleton"></div>
    </div>

    <div v-else-if="!metrics" class="empty-state">
      <p>Hardware metrics telemetry unavailable.</p>
    </div>

    <div v-else class="infra-grid">
      <!-- CPU Meter -->
      <div class="infra-card">
        <div class="card-head">
          <span class="metric-title">CPU Utilization</span>
          <span class="metric-val">{{ cpuUsagePercent.toFixed(1) }}%</span>
        </div>
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: `${cpuUsagePercent}%`, backgroundColor: getProgressColor(cpuUsagePercent) }"
          ></div>
        </div>
        <div class="card-foot">
          <span>Target Load: &lt; 75%</span>
          <span>Status: Nominal</span>
        </div>
      </div>

      <!-- RAM Meter -->
      <div class="infra-card">
        <div class="card-head">
          <span class="metric-title">RAM Usage</span>
          <span class="metric-val">
            {{ (metrics.memoryUsedMb / 1024).toFixed(1) }} / {{ (metrics.memoryTotalMb / 1024).toFixed(1) }} GB
          </span>
        </div>
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: `${memoryUsagePercent}%`, backgroundColor: getProgressColor(memoryUsagePercent) }"
          ></div>
        </div>
        <div class="card-foot">
          <span>Allocation: {{ memoryUsagePercent.toFixed(1) }}%</span>
          <span>Available: {{ ((metrics.memoryTotalMb - metrics.memoryUsedMb) / 1024).toFixed(1) }} GB</span>
        </div>
      </div>

      <!-- Disk Storage Meter -->
      <div class="infra-card">
        <div class="card-head">
          <span class="metric-title">Disk Storage</span>
          <span class="metric-val">{{ metrics.diskUsedGb }} / {{ metrics.diskTotalGb }} GB</span>
        </div>
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: `${diskUsagePercent}%`, backgroundColor: getProgressColor(diskUsagePercent) }"
          ></div>
        </div>
        <div class="card-foot">
          <span>Used: {{ diskUsagePercent.toFixed(1) }}%</span>
          <span>NVMe Storage</span>
        </div>
      </div>

      <!-- Network I/O -->
      <div class="infra-card">
        <div class="card-head">
          <span class="metric-title">Network Traffic</span>
          <span class="metric-val">{{ metrics.activeConnections }} Conns</span>
        </div>
        <div class="net-io-details">
          <div class="io-item">
            <span class="io-label">Incoming (Rx):</span>
            <span class="io-val rx">{{ metrics.networkRxKbps }} KB/s</span>
          </div>
          <div class="io-item">
            <span class="io-label">Outgoing (Tx):</span>
            <span class="io-val tx">{{ metrics.networkTxKbps }} KB/s</span>
          </div>
        </div>
        <div class="card-foot">
          <span>HTTP/WS Bandwidth</span>
          <span>Port 4000</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.infrastructure-panel {
  background: var(--admin-bg-surface, #ffffff);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-radius-md, 10px);
  padding: 1.5rem;
  box-shadow: var(--admin-shadow-sm);
}

.panel-header {
  margin-bottom: 1.25rem;
}

.panel-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--admin-text-primary, #0f172a);
  margin: 0;
}

.header-subtitle {
  font-size: 0.85rem;
  color: var(--admin-text-muted, #64748b);
}

.infra-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.infra-card {
  background: var(--admin-bg-surface-hover, #f8fafc);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-radius-sm, 8px);
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: var(--admin-primary);
  }
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .metric-title {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--admin-text-muted, #64748b);
  }

  .metric-val {
    font-size: 1rem;
    font-weight: 700;
    color: var(--admin-text-primary, #0f172a);
  }
}

.progress-track {
  height: 8px;
  background: var(--admin-bg-app, #f1f5f9);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--admin-border-color, #e2e8f0);
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease, background-color 0.4s ease;
}

.net-io-details {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  .io-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.82rem;

    .io-label { color: var(--admin-text-muted, #64748b); }
    .io-val { font-weight: 700; }
    .io-val.rx { color: var(--admin-primary, #2563eb); }
    .io-val.tx { color: var(--admin-success, #10b981); }
  }
}

.card-foot {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--admin-text-muted, #64748b);
  border-top: 1px dashed var(--admin-border-color, #e2e8f0);
  padding-top: 0.5rem;
  margin-top: 0.2rem;
}

.skeleton-infra-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;

  .infra-skeleton {
    height: 100px;
    background: var(--admin-bg-surface-hover, #f8fafc);
    border-radius: 10px;
  }
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--admin-text-muted, #64748b);
  font-size: 0.88rem;
}
</style>
