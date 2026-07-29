<template>
  <div class="dashboard-container">
    <!-- Header Section -->
    <DashboardHeader
      :is-loading="dashboardStore.isLoading"
      :is-refreshing="dashboardStore.isRefreshing"
      :last-fetched-at="dashboardStore.lastFetchedAt"
      @refresh="handleRefresh"
    />

    <!-- System Notifications Bar (Step 12) -->
    <NotificationPanel />

    <!-- Initial Skeleton Loading State -->
    <div v-if="dashboardStore.isLoading" class="dashboard-skeleton">
      <div class="skeleton-kpis">
        <div v-for="i in 4" :key="i" class="skeleton-card"></div>
      </div>
      <div class="skeleton-grid">
        <div class="skeleton-panel large"></div>
        <div class="skeleton-panel side"></div>
      </div>
    </div>

    <!-- Error State Banner -->
    <div v-else-if="dashboardStore.error" class="error-banner" role="alert">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{{ dashboardStore.error }}</span>
      <button class="btn-retry" @click="handleRefresh">Retry</button>
    </div>

    <!-- Main Dashboard Grid Content -->
    <main v-else class="dashboard-content">
      <!-- Section 1: KPI Cards Grid -->
      <section class="kpi-section" aria-label="Key Performance Indicators">
        <div class="kpi-grid">
          <KpiCard
            v-for="card in dashboardStore.kpiCards"
            :key="card.id"
            :metric="card"
          />
        </div>
      </section>

      <!-- Section 2: Analytics & System Grid -->
      <div class="dashboard-grid">
        <!-- Main Content Area -->
        <div class="grid-main">
          <!-- Section 2: Charts Grid -->
          <div class="charts-grid">
            <ChartCard
              title="Code Quality & Review Volume Trend"
              subtitle="Average quality score and inspection throughput over time"
              type="trend"
              :trend-data="dashboardStore.qualityTrend"
            />

            <div class="charts-dual-row">
              <ChartCard
                title="Language Breakdown"
                subtitle="Distribution of inspectable repositories"
                type="bar-list"
                :list-data="languageListData"
              />

              <ChartCard
                title="AI Provider Distribution"
                subtitle="LLM engine invocations share"
                type="bar-list"
                :list-data="providerListData"
              />
            </div>
          </div>
        </div>

        <!-- Sidebar Panels Area -->
        <aside class="grid-sidebar">
          <!-- Quick Actions Panel (Step 12) -->
          <QuickActionsPanel />

          <!-- System Health Panel (Step 9) -->
          <SystemHealthPanel :health="dashboardStore.health" />
          
          <!-- Queue Status Panel (Step 10) -->
          <QueueStatusPanel :status="dashboardStore.queueStatus" />

          <!-- Recent Activity Timeline (Step 11) -->
          <RecentActivityTimeline :activities="dashboardStore.recentActivities" />
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useDashboardStore } from '../../../stores/dashboard.store';
import DashboardHeader from '../components/DashboardHeader.vue';
import KpiCard from '../components/KpiCard.vue';
import ChartCard from '../components/ChartCard.vue';
import SystemHealthPanel from '../components/SystemHealthPanel.vue';
import QueueStatusPanel from '../components/QueueStatusPanel.vue';
import RecentActivityTimeline from '../components/RecentActivityTimeline.vue';
import NotificationPanel from '../components/NotificationPanel.vue';
import QuickActionsPanel from '../components/QuickActionsPanel.vue';
import { useDashboardWebSocket } from '../composables/useDashboardWebSocket';

const dashboardStore = useDashboardStore();
useDashboardWebSocket();

const languageListData = computed(() =>
  dashboardStore.languageStats.map((item) => ({
    label: item.language,
    value: item.count,
    percentage: item.percentage,
  }))
);

const providerListData = computed(() =>
  dashboardStore.providerUsage.map((item) => ({
    label: item.provider,
    value: item.count,
    percentage: item.percentage,
  }))
);

onMounted(async () => {
  await dashboardStore.fetchDashboardData();
});

async function handleRefresh() {
  await dashboardStore.fetchDashboardData(true);
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.dashboard-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skeleton-kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}

.skeleton-card {
  height: 110px;
  background: linear-gradient(90deg, var(--admin-bg-surface) 25%, var(--admin-border-color) 50%, var(--admin-bg-surface) 75%);
  background-size: 200% 100%;
  animation: pulse 1.5s infinite;
  border-radius: var(--admin-radius-lg);
}

.skeleton-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.25rem;
}

.skeleton-panel {
  height: 380px;
  background: linear-gradient(90deg, var(--admin-bg-surface) 25%, var(--admin-border-color) 50%, var(--admin-bg-surface) 75%);
  background-size: 200% 100%;
  animation: pulse 1.5s infinite;
  border-radius: var(--admin-radius-lg);
}

@keyframes pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background-color: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--admin-radius-lg);
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-retry {
  margin-left: auto;
  padding: 0.375rem 0.875rem;
  background-color: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: var(--admin-radius-md);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.grid-main, .grid-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.charts-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.charts-dual-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .charts-dual-row {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
