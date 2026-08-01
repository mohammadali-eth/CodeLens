<script setup lang="ts">
import { ref } from 'vue';

const timeRange = ref<'7d' | '30d' | '90d' | '1y'>('30d');

const kpiMetrics = [
  { id: 'total_reviews', title: 'Total Reviews Processed', value: '14,892', change: '+18.4%', isPositive: true, subtext: 'vs previous period' },
  { id: 'avg_latency', title: 'Avg AI Analysis Speed', value: '1.42s', change: '-12.5%', isPositive: true, subtext: 'faster response time' },
  { id: 'tokens_consumed', title: 'Total AI Tokens Consumed', value: '4.8M', change: '+8.2%', isPositive: true, subtext: 'across all providers' },
  { id: 'quality_score', title: 'Code Health Index', value: '94.8 / 100', change: '+3.1%', isPositive: true, subtext: 'platform quality average' },
];

const aiModelStats = [
  { provider: 'OpenAI GPT-4o', usagePercent: 52, avgLatency: '1.1s', costPer1k: '$0.0050', status: 'Optimal' },
  { provider: 'Anthropic Claude 3.5 Sonnet', usagePercent: 34, avgLatency: '1.6s', costPer1k: '$0.0030', status: 'Optimal' },
  { provider: 'Local Llama 3 70B', usagePercent: 14, avgLatency: '0.8s', costPer1k: '$0.0000', status: 'Self-Hosted' },
];

const topLanguages = [
  { name: 'TypeScript / JavaScript', percent: 45, reviews: '6,701', color: '#3178c6' },
  { name: 'Python', percent: 26, reviews: '3,872', color: '#3572A5' },
  { name: 'Go (Golang)', percent: 15, reviews: '2,234', color: '#00ADD8' },
  { name: 'Rust', percent: 8, reviews: '1,191', color: '#dea584' },
  { name: 'Java / Kotlin', percent: 6, reviews: '894', color: '#b07219' },
];

const repoLeaderboard = [
  { name: 'codelens/apps/backend', reviews: '1,420', avgTime: '1.2s', comments: 342, score: '96%' },
  { name: 'codelens/apps/admin', reviews: '980', avgTime: '1.4s', comments: 184, score: '94%' },
  { name: 'codelens/core-engine', reviews: '850', avgTime: '0.9s', comments: 512, score: '98%' },
  { name: 'codelens/shared-ui', reviews: '620', avgTime: '1.1s', comments: 96, score: '92%' },
];
</script>

<template>
  <div class="analytics-view">
    <!-- Header with controls -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Platform Analytics & Intelligence</h1>
        <p class="page-description">Deep telemetry insight into AI model latency, review volumes, code quality scores, and language distributions.</p>
      </div>

      <div class="time-filter">
        <button
          v-for="range in (['7d', '30d', '90d', '1y'] as const)"
          :key="range"
          class="range-btn"
          :class="{ active: timeRange === range }"
          @click="timeRange = range"
        >
          {{ range.toUpperCase() }}
        </button>
      </div>
    </div>

    <!-- KPI Summary Grid -->
    <div class="kpi-grid">
      <div v-for="kpi in kpiMetrics" :key="kpi.id" class="kpi-card">
        <span class="kpi-title">{{ kpi.title }}</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ kpi.value }}</span>
          <span class="kpi-badge" :class="{ positive: kpi.isPositive }">{{ kpi.change }}</span>
        </div>
        <span class="kpi-subtext">{{ kpi.subtext }}</span>
      </div>
    </div>

    <!-- Charts & Analytics Section -->
    <div class="analytics-grid">
      <!-- Language Distribution Card -->
      <div class="panel-card">
        <h3 class="panel-title">Code Language Share</h3>
        <p class="panel-subtitle">Distribution of code reviews across programming languages.</p>
        
        <div class="language-list">
          <div v-for="lang in topLanguages" :key="lang.name" class="lang-item">
            <div class="lang-header">
              <span class="lang-name">{{ lang.name }}</span>
              <span class="lang-meta">{{ lang.reviews }} reviews ({{ lang.percent }}%)</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: lang.percent + '%', backgroundColor: lang.color }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Provider Latency Benchmark -->
      <div class="panel-card">
        <h3 class="panel-title">AI Provider Telemetry Benchmark</h3>
        <p class="panel-subtitle">Comparative latency and cost throughput per provider model.</p>

        <div class="table-responsive">
          <table class="telemetry-table">
            <thead>
              <tr>
                <th>Model / Provider</th>
                <th>Usage Share</th>
                <th>Avg Response</th>
                <th>Cost / 1k</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ai in aiModelStats" :key="ai.provider">
                <td class="provider-cell">{{ ai.provider }}</td>
                <td>
                  <div class="usage-bar">
                    <span>{{ ai.usagePercent }}%</span>
                    <div class="usage-track">
                      <div class="usage-fill" :style="{ width: ai.usagePercent + '%' }"></div>
                    </div>
                  </div>
                </td>
                <td class="latency-cell">{{ ai.avgLatency }}</td>
                <td class="cost-cell">{{ ai.costPer1k }}</td>
                <td>
                  <span class="status-chip">{{ ai.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Repository Throughput Leaderboard -->
    <div class="panel-card">
      <h3 class="panel-title">Top Repository Review Performance</h3>
      <p class="panel-subtitle">Review velocity and automated comment density per repository.</p>

      <div class="table-responsive">
        <table class="repo-table">
          <thead>
            <tr>
              <th>Repository</th>
              <th>Reviews Conducted</th>
              <th>Avg Duration</th>
              <th>Inline Comments</th>
              <th>Code Quality Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="repo in repoLeaderboard" :key="repo.name">
              <td class="repo-name"><code>{{ repo.name }}</code></td>
              <td>{{ repo.reviews }}</td>
              <td class="time-cell">{{ repo.avgTime }}</td>
              <td class="comments-cell">{{ repo.comments }} comments</td>
              <td>
                <span class="score-badge">{{ repo.score }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.analytics-view {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin-bottom: 0.25rem;
}
.page-description {
  color: var(--admin-text-secondary);
  font-size: 0.9rem;
}

.time-filter {
  display: flex;
  gap: 0.35rem;
  background: var(--admin-bg-surface);
  padding: 0.25rem;
  border-radius: var(--admin-radius-sm);
  border: 1px solid var(--admin-border-color);
}

.range-btn {
  padding: 0.35rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--admin-text-muted);
  font-size: 0.78rem;
  font-weight: 700;
  border-radius: var(--admin-radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;

  &.active, &:hover {
    background: var(--admin-primary);
    color: #ffffff;
  }
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.kpi-card {
  background: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 1.25rem;
  box-shadow: var(--admin-shadow-sm);

  .kpi-title {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--admin-text-muted);
  }

  .kpi-value-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin: 0.5rem 0 0.25rem 0;
  }

  .kpi-value {
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--admin-text-primary);
  }

  .kpi-badge {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;

    &.positive {
      color: var(--admin-success);
      background: rgba(16, 185, 129, 0.12);
    }
  }

  .kpi-subtext {
    font-size: 0.75rem;
    color: var(--admin-text-muted);
  }
}

.analytics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.panel-card {
  background: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 1.5rem;
  box-shadow: var(--admin-shadow-sm);
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin-bottom: 0.2rem;
}

.panel-subtitle {
  font-size: 0.82rem;
  color: var(--admin-text-muted);
  margin-bottom: 1.25rem;
}

.language-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lang-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.lang-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
}

.lang-name { font-weight: 600; color: var(--admin-text-primary); }
.lang-meta { color: var(--admin-text-muted); }

.progress-bar-bg {
  height: 8px;
  background: var(--admin-bg-app);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.4s ease;
}

.table-responsive { overflow-x: auto; }

.telemetry-table, .repo-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;

  th, td { padding: 0.8rem 0.75rem; border-bottom: 1px solid var(--admin-border-color); }
  th { font-size: 0.75rem; text-transform: uppercase; color: var(--admin-text-muted); font-weight: 600; }
}

.provider-cell { font-weight: 600; color: var(--admin-text-primary); }
.latency-cell { font-family: monospace; font-weight: 700; color: var(--admin-primary); }
.cost-cell { font-family: monospace; color: var(--admin-text-muted); }

.usage-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--admin-text-primary);
}

.usage-track {
  flex: 1;
  height: 6px;
  background: var(--admin-bg-app);
  border-radius: 9999px;
  overflow: hidden;
}

.usage-fill {
  height: 100%;
  background: var(--admin-primary);
  border-radius: 9999px;
}

.status-chip {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background: rgba(16, 185, 129, 0.12);
  color: var(--admin-success);
}

.repo-name code {
  font-family: monospace;
  font-weight: 600;
  color: var(--admin-primary);
  background: var(--admin-primary-glow);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.score-badge {
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--admin-success);
  background: rgba(16, 185, 129, 0.12);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}
</style>
