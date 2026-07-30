<template>
  <div class="reviews-view">
    <!-- View Header -->
    <header class="view-header">
      <div class="header-title-block">
        <h1 class="view-title">Code Review Administration</h1>
        <p class="view-description">
          Inspect, moderate, manage, and monitor AI code reviews across the platform in real-time.
        </p>
      </div>

      <div class="header-action-block">
        <button
          type="button"
          class="btn-refresh"
          :disabled="store.isLoading"
          title="Refresh Review Directory"
          @click="refreshData"
        >
          <svg
            class="refresh-icon"
            :class="{ spinning: store.isLoading }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>
    </header>

    <!-- Alert / Feedback Message -->
    <Transition name="fade">
      <div v-if="feedbackMessage" class="feedback-alert" :class="`alert-${feedbackType}`">
        <span class="alert-icon">
          <svg v-if="feedbackType === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </span>
        <span class="alert-text">{{ feedbackMessage }}</span>
        <button type="button" class="alert-close" aria-label="Dismiss message" @click="feedbackMessage = null">✕</button>
      </div>
    </Transition>

    <!-- Error Alert -->
    <div v-if="store.error" class="feedback-alert alert-error">
      <span class="alert-icon">⚠️</span>
      <span class="alert-text">{{ store.error }}</span>
      <button type="button" class="alert-close" aria-label="Dismiss error" @click="store.error = null">✕</button>
    </div>

    <!-- Realtime Telemetry Stats Widget -->
    <RealtimeMetricsWidget
      :stats="store.reviewStats"
      :is-connected="isConnected"
      :last-event-timestamp="lastEventTimestamp"
    />

    <!-- Filter & Search Bar Panel -->
    <ReviewFilterPanel />

    <!-- Main Review Data Directory Table / Grid -->
    <ReviewTable
      @select-review="handleSelectReview"
      @rerun-review="handleRerunReview"
      @delete-review="handleDeleteReview"
    />

    <!-- Review Inspection Detail Drawer -->
    <ReviewDetailDrawer
      :is-open="isDrawerOpen"
      :review="store.selectedReview"
      :is-loading="store.isDetailLoading"
      :is-moderating="store.isActionLoading"
      @close="closeDrawer"
      @rerun="handleRerunReview"
      @download-report="handleDownloadReport"
      @archive-toggle="handleArchiveToggle"
      @delete="handleDeleteReview"
      @save-moderation="handleSaveModeration"
    />

    <!-- Bulk Action Floating Capsule Bar -->
    <BulkActionToolbar @action-completed="handleBulkCompleted" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useReviewsStore } from '../../../stores/reviews.store';
import { useReviewRealtime } from '../composables/useReviewRealtime';

import RealtimeMetricsWidget from '../components/RealtimeMetricsWidget.vue';
import ReviewFilterPanel from '../components/ReviewFilterPanel.vue';
import ReviewTable from '../components/ReviewTable.vue';
import ReviewDetailDrawer from '../components/ReviewDetailDrawer.vue';
import BulkActionToolbar from '../components/BulkActionToolbar.vue';

const store = useReviewsStore();
const { isConnected, lastEventTimestamp } = useReviewRealtime();

const isDrawerOpen = ref<boolean>(false);
const feedbackMessage = ref<string | null>(null);
const feedbackType = ref<'success' | 'error'>('success');

onMounted(async () => {
  await Promise.all([
    store.fetchReviews(),
    store.fetchStats(),
  ]);
});

function showFeedback(msg: string, type: 'success' | 'error' = 'success') {
  feedbackMessage.value = msg;
  feedbackType.value = type;
  setTimeout(() => {
    if (feedbackMessage.value === msg) feedbackMessage.value = null;
  }, 4000);
}

async function refreshData() {
  await Promise.all([
    store.fetchReviews(),
    store.fetchStats(),
  ]);
  showFeedback('Code review directory and telemetry refreshed.');
}

async function handleSelectReview(id: string) {
  isDrawerOpen.value = true;
  await store.fetchReviewById(id);
}

function closeDrawer() {
  isDrawerOpen.value = false;
  store.selectedReview = null;
}

async function handleRerunReview(id: string) {
  try {
    await store.rerunReview(id);
    showFeedback(`Re-analysis queued for review ${id}.`);
  } catch (err: any) {
    showFeedback(err.message || 'Failed to rerun code review.', 'error');
  }
}

async function handleDeleteReview(id: string) {
  if (confirm(`Are you sure you want to delete review ${id}?`)) {
    const ok = await store.deleteReview(id);
    if (ok) {
      if (store.selectedReview?.id === id) closeDrawer();
      showFeedback(`Review ${id} successfully deleted.`);
    } else {
      showFeedback('Failed to delete code review.', 'error');
    }
  }
}

async function handleDownloadReport(id: string) {
  try {
    const report = await store.downloadReport(id);
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `review-report-${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback(`Report for review ${id} generated and downloaded.`);
  } catch (err: any) {
    showFeedback(err.message || 'Failed to download report.', 'error');
  }
}

async function handleArchiveToggle(id: string) {
  try {
    if (store.selectedReview?.isArchived) {
      await store.restoreReview(id);
      showFeedback(`Review ${id} restored from archives.`);
    } else {
      await store.archiveReview(id);
      showFeedback(`Review ${id} archived.`);
    }
  } catch (err: any) {
    showFeedback(err.message || 'Failed to update review archive state.', 'error');
  }
}

async function handleSaveModeration(payload: { isFlagged: boolean; isHidden: boolean; moderatorNotes: string }) {
  if (!store.selectedReview) return;
  try {
    await store.updateModeration({
      reviewId: store.selectedReview.id,
      ...payload,
    });
    showFeedback(`Moderation settings updated for review ${store.selectedReview.id}.`);
  } catch (err: any) {
    showFeedback(err.message || 'Failed to save moderation settings.', 'error');
  }
}

function handleBulkCompleted(msg: string) {
  showFeedback(msg);
}
</script>

<style scoped>
.reviews-view {
  padding: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.view-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--admin-border-color);
}

.header-title-block {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--admin-text-primary);
  margin: 0;
  letter-spacing: -0.02em;
}

.view-description {
  font-size: 0.875rem;
  color: var(--admin-text-muted);
  margin: 0;
}

.btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-surface);
  color: var(--admin-text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--admin-shadow-sm);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: var(--admin-primary);
    color: var(--admin-primary);
    background-color: var(--admin-bg-surface-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.refresh-icon {
  width: 1rem;
  height: 1rem;

  &.spinning {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Alerts */
.feedback-alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border-radius: var(--admin-radius-md);
  font-size: 0.875rem;
  font-weight: 600;
}

.alert-success {
  background-color: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.alert-error {
  background-color: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.alert-icon {
  display: flex;
  align-items: center;

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
}

.alert-text {
  flex: 1;
}

.alert-close {
  border: none;
  background: transparent;
  color: currentColor;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
