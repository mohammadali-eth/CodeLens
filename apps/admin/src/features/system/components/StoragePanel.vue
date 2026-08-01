<script setup lang="ts">
import { StorageTelemetry } from '../models/system-admin.model';

defineProps<{
  storage: StorageTelemetry | null;
}>();
</script>

<template>
  <div class="panel-card">
    <div class="panel-header">
      <h3 class="panel-title">Storage Provider & Allocation Telemetry</h3>
      <p class="panel-subtitle">Monitor disk partition capacity, object storage buckets, and max file upload limits.</p>
    </div>

    <div v-if="!storage" class="empty-state">
      <p>Storage telemetry unavailable.</p>
    </div>

    <div v-else class="storage-content">
      <div class="storage-metrics-grid">
        <div class="metric-box">
          <span class="label">Storage Provider</span>
          <span class="value">{{ storage.provider }}</span>
        </div>

        <div class="metric-box">
          <span class="label">Used / Capacity</span>
          <span class="value">
            {{ (storage.usedSpaceBytes / (1024 * 1024 * 1024)).toFixed(1) }} GB / {{ (storage.totalSpaceBytes / (1024 * 1024 * 1024)).toFixed(1) }} GB
          </span>
        </div>

        <div class="metric-box">
          <span class="label">Active Buckets</span>
          <span class="value">{{ storage.activeBucketsCount }} Buckets</span>
        </div>

        <div class="metric-box">
          <span class="label">Max Upload Limit</span>
          <span class="value">{{ storage.maxFileUploadMb }} MB / File</span>
        </div>
      </div>

      <div class="usage-meter-box">
        <div class="meter-head">
          <span class="meter-title">Storage Partition Usage</span>
          <span class="meter-val">{{ storage.usedPercentage.toFixed(1) }}% Used</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${storage.usedPercentage}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel-card {
  background: var(--admin-bg-surface, #ffffff);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-radius-md, 10px);
  padding: 1.5rem;
  box-shadow: var(--admin-shadow-sm);
}

.panel-header { margin-bottom: 1.5rem; }
.panel-title { font-size: 1.2rem; font-weight: 700; color: var(--admin-text-primary, #0f172a); margin: 0; }
.panel-subtitle { font-size: 0.85rem; color: var(--admin-text-muted, #64748b); margin-top: 0.2rem; }

.storage-content { display: flex; flex-direction: column; gap: 1.5rem; }

.storage-metrics-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;
}

.metric-box {
  background: var(--admin-bg-surface-hover, #f8fafc);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-radius-sm, 8px);
  padding: 1rem;
  display: flex; flex-direction: column; gap: 0.3rem;

  .label { font-size: 0.78rem; font-weight: 600; color: var(--admin-text-muted, #64748b); text-transform: uppercase; }
  .value { font-size: 1.25rem; font-weight: 700; color: var(--admin-text-primary, #0f172a); }
}

.usage-meter-box {
  display: flex; flex-direction: column; gap: 0.5rem;
  .meter-head { display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 600; }
  .progress-track { height: 10px; background: var(--admin-bg-app, #f1f5f9); border-radius: 5px; overflow: hidden; border: 1px solid var(--admin-border-color, #e2e8f0); }
  .progress-fill { height: 100%; background: var(--admin-primary, #2563eb); border-radius: 5px; }
}

.empty-state { padding: 2rem; text-align: center; color: var(--admin-text-muted, #64748b); }
</style>
