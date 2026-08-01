<script setup lang="ts">
import { computed } from 'vue';
import { OverviewMetricsCard } from '../models/monitoring.model';

const props = defineProps<{
  card: OverviewMetricsCard;
  isLoading?: boolean;
}>();

const trendClass = computed(() => {
  if (props.card.changeDirection === 'up') return 'trend-up';
  if (props.card.changeDirection === 'down') return 'trend-down';
  return 'trend-neutral';
});

const statusBadgeClass = computed(() => {
  switch (props.card.statusTag) {
    case 'HEALTHY':
      return 'badge-healthy';
    case 'WARNING':
      return 'badge-warning';
    case 'CRITICAL':
      return 'badge-critical';
    case 'OFFLINE':
      return 'badge-offline';
    default:
      return '';
  }
});
</script>

<template>
  <div class="metrics-card-wrapper" :class="{ 'is-loading': isLoading }">
    <div v-if="isLoading" class="skeleton-container" aria-busy="true">
      <div class="skeleton-line skeleton-header"></div>
      <div class="skeleton-line skeleton-value"></div>
      <div class="skeleton-line skeleton-footer"></div>
    </div>

    <div v-else class="metrics-card-content" role="region" :aria-label="card.label">
      <div class="card-top-row">
        <span class="card-label">{{ card.label }}</span>
        <div class="card-icon-box">
          <svg v-if="card.iconName === 'users'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-icon">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>

          <svg v-else-if="card.iconName === 'activity'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-icon">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>

          <svg v-else-if="card.iconName === 'file-text'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>

          <svg v-else-if="card.iconName === 'zap'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-icon">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>

          <svg v-else-if="card.iconName === 'cpu'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-icon">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            <rect x="9" y="9" width="6" height="6"></rect>
            <line x1="9" y1="1" x2="9" y2="4"></line>
            <line x1="15" y1="1" x2="15" y2="4"></line>
            <line x1="9" y1="20" x2="9" y2="23"></line>
            <line x1="15" y1="20" x2="15" y2="23"></line>
            <line x1="20" y1="9" x2="23" y2="9"></line>
            <line x1="20" y1="15" x2="23" y2="15"></line>
            <line x1="1" y1="9" x2="4" y2="9"></line>
            <line x1="1" y1="15" x2="4" y2="15"></line>
          </svg>

          <svg v-else-if="card.iconName === 'layers'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-icon">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>

          <svg v-else-if="card.iconName === 'clock'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>

          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-icon">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
      </div>

      <div class="card-middle-row">
        <span class="card-value">{{ card.value }}</span>
      </div>

      <div class="card-bottom-row">
        <template v-if="card.statusTag">
          <span class="status-badge" :class="statusBadgeClass">
            <span class="status-dot"></span>
            {{ card.statusTag }}
          </span>
        </template>

        <template v-else-if="card.changePercent !== undefined">
          <span class="trend-badge" :class="trendClass">
            <span v-if="card.changeDirection === 'up'">↑</span>
            <span v-else-if="card.changeDirection === 'down'">↓</span>
            {{ Math.abs(card.changePercent) }}% vs last week
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.metrics-card-wrapper {
  background-color: var(--admin-bg-surface, #1e293b);
  border: 1px solid var(--admin-border-color, #334155);
  border-radius: 12px;
  padding: 1.25rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    border-color: var(--admin-primary-color, #3b82f6);
  }
}

.metrics-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--admin-text-secondary, #94a3b8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  .feather-icon {
    width: 20px;
    height: 20px;
    stroke: var(--admin-primary-color, #3b82f6);
  }
}

.card-middle-row {
  display: flex;
  align-items: baseline;
}

.card-value {
  font-size: 1.65rem;
  font-weight: 700;
  color: var(--admin-text-primary, #f8fafc);
  letter-spacing: -0.02em;
}

.card-bottom-row {
  display: flex;
  align-items: center;
  font-size: 0.78rem;
}

.trend-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;

  &.trend-up {
    color: #10b981;
    background: rgba(16, 185, 129, 0.12);
  }

  &.trend-down {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.12);
  }

  &.trend-neutral {
    color: #94a3b8;
    background: rgba(148, 163, 184, 0.12);
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  text-transform: uppercase;

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
  }

  &.badge-healthy {
    color: #10b981;
    background: rgba(16, 185, 129, 0.15);
    .status-dot { background-color: #10b981; }
  }

  &.badge-warning {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.15);
    .status-dot { background-color: #f59e0b; }
  }

  &.badge-critical {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.15);
    .status-dot { background-color: #ef4444; }
  }

  &.badge-offline {
    color: #64748b;
    background: rgba(100, 116, 139, 0.15);
    .status-dot { background-color: #64748b; }
  }
}

.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  .skeleton-line {
    background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }

  .skeleton-header { height: 14px; width: 60%; }
  .skeleton-value { height: 28px; width: 45%; }
  .skeleton-footer { height: 12px; width: 80%; }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
