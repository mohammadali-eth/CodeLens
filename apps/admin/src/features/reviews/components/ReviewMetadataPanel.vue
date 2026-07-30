<template>
  <div class="metadata-panel">
    <h4 class="panel-section-title">Review Metadata & System Specs</h4>
    
    <div class="specs-grid">
      <div class="spec-card">
        <span class="spec-label">Review ID</span>
        <span class="spec-value font-mono">{{ review.id }}</span>
      </div>

      <div class="spec-card">
        <span class="spec-label">Owner</span>
        <span class="spec-value">{{ review.ownerName }}</span>
        <span class="spec-subtext">{{ review.ownerEmail }}</span>
      </div>

      <div class="spec-card">
        <span class="spec-label">Programming Language</span>
        <span class="spec-value lang-tag">{{ review.language }}</span>
      </div>

      <div class="spec-card">
        <span class="spec-label">AI Engine & Model</span>
        <span class="spec-value">{{ review.aiProvider }}</span>
        <span class="spec-subtext">{{ review.aiModel }}</span>
      </div>

      <div class="spec-card">
        <span class="spec-label">Quality Score</span>
        <div class="score-row">
          <QualityScoreBadge :score="review.score" />
        </div>
      </div>

      <div class="spec-card">
        <span class="spec-label">Execution Latency</span>
        <span class="spec-value">{{ (review.processingTimeMs / 1000).toFixed(2) }} sec</span>
      </div>

      <div class="spec-card">
        <span class="spec-label">Time Complexity</span>
        <span class="spec-value complexity-tag">{{ review.timeComplexity || 'O(n)' }}</span>
      </div>

      <div class="spec-card">
        <span class="spec-label">Space Complexity</span>
        <span class="spec-value complexity-tag">{{ review.spaceComplexity || 'O(1)' }}</span>
      </div>

      <div class="spec-card">
        <span class="spec-label">Created At</span>
        <span class="spec-value">{{ formatDate(review.createdAt) }}</span>
      </div>

      <div class="spec-card">
        <span class="spec-label">Last Updated</span>
        <span class="spec-value">{{ formatDate(review.updatedAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AdminReviewDetail } from '../models/review.model';
import QualityScoreBadge from './QualityScoreBadge.vue';

defineProps<{
  review: AdminReviewDetail;
}>();

function formatDate(iso: string) {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<style scoped>
.metadata-panel {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.panel-section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--admin-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.875rem;
}

.spec-card {
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.spec-label {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
  font-weight: 600;
}

.spec-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}

.spec-subtext {
  font-size: 0.75rem;
  color: var(--admin-text-secondary);
}

.font-mono {
  font-family: var(--admin-font-mono);
}

.lang-tag {
  text-transform: capitalize;
  color: var(--admin-primary);
}

.complexity-tag {
  font-family: var(--admin-font-mono);
  color: #8b5cf6;
}

.score-row {
  display: flex;
  align-items: center;
}
</style>
