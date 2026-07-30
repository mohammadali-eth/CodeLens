<template>
  <div class="review-card" :class="{ 'is-selected': isSelected }" @click="$emit('select')">
    <div class="card-header">
      <div class="header-left">
        <input
          type="checkbox"
          :checked="isSelected"
          @click.stop
          @change="$emit('toggle-select')"
        />
        <span class="review-id font-mono">{{ review.id }}</span>
      </div>
      <ReviewStatusBadge :status="review.status" />
    </div>

    <div class="card-body">
      <h4 class="card-title">{{ review.title }}</h4>
      <p class="owner-text">{{ review.ownerName }} • {{ review.ownerEmail }}</p>

      <div class="metrics-row">
        <div class="metric-item">
          <span class="m-label">Language</span>
          <span class="m-val lang-tag">{{ review.language }}</span>
        </div>
        <div class="metric-item">
          <span class="m-label">Score</span>
          <QualityScoreBadge :score="review.score" />
        </div>
      </div>

      <div class="info-footer">
        <span class="provider-tag">{{ review.aiProvider }} ({{ review.aiModel }})</span>
        <span class="time-tag">{{ (review.processingTimeMs / 1000).toFixed(2) }}s</span>
      </div>
    </div>

    <div class="card-actions" @click.stop>
      <button type="button" class="card-btn" title="Re-run Review" @click="$emit('rerun')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        Re-run
      </button>
      <button type="button" class="card-btn btn-danger" title="Delete Review" @click="$emit('delete')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AdminReviewItem } from '../models/review.model';
import ReviewStatusBadge from './ReviewStatusBadge.vue';
import QualityScoreBadge from './QualityScoreBadge.vue';

defineProps<{
  review: AdminReviewItem;
  isSelected?: boolean;
}>();

defineEmits<{
  (e: 'select'): void;
  (e: 'toggle-select'): void;
  (e: 'rerun'): void;
  (e: 'delete'): void;
}>();
</script>

<style scoped>
.review-card {
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  box-shadow: var(--admin-shadow-sm);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--admin-shadow-md);
    border-color: var(--admin-primary);
  }

  &.is-selected {
    border-color: var(--admin-primary);
    background-color: rgba(37, 99, 235, 0.04);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.review-id {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--admin-primary);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0;
}

.owner-text {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
  margin: 0;
}

.metrics-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-top: 1px solid var(--admin-border-color);
  border-bottom: 1px solid var(--admin-border-color);
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.m-label {
  font-size: 0.6875rem;
  color: var(--admin-text-muted);
  text-transform: uppercase;
  font-weight: 600;
}

.lang-tag {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--admin-primary);
  text-transform: capitalize;
}

.info-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--admin-text-muted);
}

.provider-tag {
  font-weight: 600;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.card-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-app);
  color: var(--admin-text-primary);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: var(--admin-primary);
    color: var(--admin-primary);
  }

  &.btn-danger:hover {
    border-color: #ef4444;
    color: #ef4444;
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
}
</style>
