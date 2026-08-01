<script setup lang="ts">
import { AIAnalyticsData } from '../models/monitoring.model';

defineProps<{
  aiAnalytics: AIAnalyticsData | null;
  isLoading?: boolean;
}>();
</script>

<template>
  <div class="ai-analytics-panel">
    <div class="panel-header">
      <div class="header-left">
        <h3 class="panel-title">AI Engine Token & Cost Analytics</h3>
        <span class="header-subtitle">Multi-provider model consumption, token counts, estimated spend, and model latencies</span>
      </div>
    </div>

    <div v-if="isLoading" class="skeleton-ai-box">
      <div class="ai-skeleton"></div>
    </div>

    <div v-else-if="!aiAnalytics" class="empty-state">
      <p>AI analytics data unavailable.</p>
    </div>

    <div v-else class="ai-content">
      <!-- Top Metrics Summary Cards -->
      <div class="ai-summary-row">
        <div class="ai-summary-card">
          <span class="card-label">Total AI Calls</span>
          <span class="card-val">{{ aiAnalytics.totalCalls.toLocaleString() }}</span>
        </div>

        <div class="ai-summary-card">
          <span class="card-label">Total Tokens</span>
          <span class="card-val">{{ (aiAnalytics.totalTokens / 1000000).toFixed(2) }}M</span>
          <span class="card-sub">{{ (aiAnalytics.totalPromptTokens / 1000000).toFixed(2) }}M Prompt / {{ (aiAnalytics.totalCompletionTokens / 1000000).toFixed(2) }}M Completion</span>
        </div>

        <div class="ai-summary-card">
          <span class="card-label">Estimated Spend</span>
          <span class="card-val text-cost">${{ aiAnalytics.totalCostUsd.toFixed(2) }}</span>
        </div>

        <div class="ai-summary-card">
          <span class="card-label">Avg AI Latency</span>
          <span class="card-val">{{ aiAnalytics.avgLatencyMs }} ms</span>
        </div>
      </div>

      <!-- Provider Distribution Bars -->
      <div class="provider-distribution-section">
        <h4 class="section-subtitle">AI Provider Distribution & Costs</h4>
        <div class="provider-bars-grid">
          <div v-for="p in aiAnalytics.providerDistribution" :key="p.provider" class="provider-bar-card">
            <div class="provider-head">
              <span class="provider-name">{{ p.provider }}</span>
              <span class="provider-percent">{{ p.percentage }}%</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: `${p.percentage}%` }"></div>
            </div>
            <div class="provider-foot">
              <span>{{ p.callsCount.toLocaleString() }} calls</span>
              <span class="cost-tag">${{ p.costEstimate.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Model Breakdown Table -->
      <div class="model-breakdown-section">
        <h4 class="section-subtitle">Model Usage Breakdown</h4>
        <div class="table-responsive">
          <table class="model-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Provider</th>
                <th>Prompt Tokens</th>
                <th>Completion Tokens</th>
                <th>Total Tokens</th>
                <th>Est. Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in aiAnalytics.modelBreakdown" :key="m.model">
                <td class="font-bold">{{ m.model }}</td>
                <td>
                  <span class="provider-badge">{{ m.provider }}</span>
                </td>
                <td>{{ m.promptTokens.toLocaleString() }}</td>
                <td>{{ m.completionTokens.toLocaleString() }}</td>
                <td>{{ m.totalTokens.toLocaleString() }}</td>
                <td class="cost-val">${{ m.estimatedCostUsd.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-analytics-panel {
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

.ai-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ai-summary-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.ai-summary-card {
  background: var(--admin-bg-surface-hover, #f8fafc);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-radius-sm, 8px);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  .card-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--admin-text-muted, #64748b);
    text-transform: uppercase;
  }

  .card-val {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--admin-text-primary, #0f172a);

    &.text-cost { color: var(--admin-success, #10b981); }
  }

  .card-sub {
    font-size: 0.72rem;
    color: var(--admin-text-muted, #64748b);
  }
}

.section-subtitle {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--admin-text-primary, #0f172a);
  margin-bottom: 0.85rem;
}

.provider-bars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.provider-bar-card {
  background: var(--admin-bg-surface-hover, #f8fafc);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-radius-sm, 8px);
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.provider-head {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--admin-text-primary, #0f172a);
}

.bar-track {
  height: 6px;
  background: var(--admin-bg-app, #f1f5f9);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid var(--admin-border-color, #e2e8f0);

  .bar-fill {
    height: 100%;
    background: var(--admin-primary, #2563eb);
    border-radius: 3px;
  }
}

.provider-foot {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--admin-text-muted, #64748b);

  .cost-tag { color: var(--admin-success, #10b981); font-weight: 600; }
}

.table-responsive {
  overflow-x: auto;
}

.model-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;

  th, td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--admin-border-color, #e2e8f0);
  }

  th {
    color: var(--admin-text-muted, #64748b);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
  }

  td {
    color: var(--admin-text-primary, #0f172a);
  }

  .font-bold { font-weight: 600; }
  .cost-val { color: var(--admin-success, #10b981); font-weight: 700; }

  .provider-badge {
    background: var(--admin-primary-glow, rgba(37, 99, 235, 0.12));
    color: var(--admin-primary, #2563eb);
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.15rem 0.45rem;
    border-radius: 4px;
  }
}

.skeleton-ai-box {
  height: 220px;
  background: var(--admin-bg-surface-hover, #f8fafc);
  border-radius: 10px;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--admin-text-muted, #64748b);
  font-size: 0.88rem;
}
</style>
