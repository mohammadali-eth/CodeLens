<template>
  <div class="table-feature-container">
    <!-- Toolbar Header (Results Count & View Mode Toggle) -->
    <div class="table-header-toolbar">
      <div class="results-count">
        <span class="count-val">Showing {{ store.reviews.length }} of {{ store.totalReviews }} code reviews</span>
        <span v-if="store.hasSelectedReviews" class="selected-tag">
          ({{ store.selectedReviewsCount }} selected)
        </span>
      </div>

      <div class="view-mode-toggles">
        <button
          type="button"
          class="toggle-btn"
          :class="{ active: viewMode === 'table' }"
          title="Table View"
          @click="viewMode = 'table'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
        </button>
        <button
          type="button"
          class="toggle-btn"
          :class="{ active: viewMode === 'grid' }"
          title="Grid Card View"
          @click="viewMode = 'grid'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
        </button>
      </div>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="store.isLoading" class="skeleton-wrapper">
      <div v-for="i in 5" :key="i" class="skeleton-row"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="store.reviews.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
      </div>
      <h3 class="empty-title">No Code Reviews Found</h3>
      <p class="empty-desc">No review items match the current search query or applied filters.</p>
    </div>

    <!-- Tabular Data View -->
    <div v-else-if="viewMode === 'table'" class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-checkbox">
              <input
                type="checkbox"
                :checked="store.isAllSelected"
                @change="store.toggleSelectAll"
              />
            </th>
            <th>Review ID</th>
            <th>Title & Owner</th>
            <th>Language</th>
            <th>AI Provider / Model</th>
            <th>Status</th>
            <th>Quality Score</th>
            <th>Latency</th>
            <th>Created At</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in store.reviews"
            :key="item.id"
            :class="{ 'is-selected': store.selectedReviewIds.has(item.id) }"
            @click="$emit('select-review', item.id)"
          >
            <td class="col-checkbox" @click.stop>
              <input
                type="checkbox"
                :checked="store.selectedReviewIds.has(item.id)"
                @change="store.toggleReviewSelection(item.id)"
              />
            </td>

            <td class="col-id font-mono">{{ item.id }}</td>

            <td class="col-main">
              <div class="title-cell">
                <span class="review-title">{{ item.title }}</span>
                <span class="owner-meta">{{ item.ownerName }} • {{ item.ownerEmail }}</span>
              </div>
            </td>

            <td>
              <span class="lang-tag">{{ item.language }}</span>
            </td>

            <td class="col-model">
              <div class="model-cell">
                <span class="provider-name">{{ item.aiProvider }}</span>
                <span class="model-name">{{ item.aiModel }}</span>
              </div>
            </td>

            <td>
              <ReviewStatusBadge :status="item.status" />
            </td>

            <td>
              <QualityScoreBadge :score="item.score" />
            </td>

            <td class="font-mono text-muted">
              {{ (item.processingTimeMs / 1000).toFixed(2) }}s
            </td>

            <td class="text-muted">
              {{ formatDate(item.createdAt) }}
            </td>

            <td class="col-actions" @click.stop>
              <div class="actions-cell">
                <button
                  type="button"
                  class="action-btn"
                  title="Re-run AI Analysis"
                  @click="$emit('rerun-review', item.id)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                </button>
                <button
                  type="button"
                  class="action-btn danger"
                  title="Delete Review"
                  @click="$emit('delete-review', item.id)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Grid Card View -->
    <div v-else class="grid-layout">
      <ReviewCard
        v-for="item in store.reviews"
        :key="item.id"
        :review="item"
        :is-selected="store.selectedReviewIds.has(item.id)"
        @select="$emit('select-review', item.id)"
        @toggle-select="store.toggleReviewSelection(item.id)"
        @rerun="$emit('rerun-review', item.id)"
        @delete="$emit('delete-review', item.id)"
      />
    </div>

    <!-- Pagination Footer Bar -->
    <div v-if="store.totalReviews > 0" class="pagination-footer">
      <div class="page-size-selector">
        <label class="ps-label">Page Size:</label>
        <select
          :value="store.filters.pageSize"
          class="ps-select"
          @change="onPageSizeChange"
        >
          <option :value="10">10 per page</option>
          <option :value="25">25 per page</option>
          <option :value="50">50 per page</option>
        </select>
      </div>

      <div class="pagination-controls">
        <button
          type="button"
          class="page-btn"
          :disabled="store.filters.page <= 1"
          @click="store.setPage(store.filters.page - 1)"
        >
          Previous
        </button>

        <span class="page-info">
          Page <strong>{{ store.filters.page }}</strong> of <strong>{{ store.totalPages }}</strong>
        </span>

        <button
          type="button"
          class="page-btn"
          :disabled="store.filters.page >= store.totalPages"
          @click="store.setPage(store.filters.page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useReviewsStore } from '../../../stores/reviews.store';
import ReviewStatusBadge from './ReviewStatusBadge.vue';
import QualityScoreBadge from './QualityScoreBadge.vue';
import ReviewCard from './ReviewCard.vue';

const store = useReviewsStore();
const viewMode = ref<'table' | 'grid'>('table');

defineEmits<{
  (e: 'select-review', id: string): void;
  (e: 'rerun-review', id: string): void;
  (e: 'delete-review', id: string): void;
}>();

function onPageSizeChange(e: Event) {
  const size = Number((e.target as HTMLSelectElement).value);
  store.setPageSize(size);
}

function formatDate(iso: string) {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
</script>

<style scoped>
.table-feature-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.table-header-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.results-count {
  font-size: 0.875rem;
  color: var(--admin-text-secondary);
  font-weight: 500;
}

.count-val {
  font-weight: 700;
  color: var(--admin-text-primary);
}

.selected-tag {
  color: var(--admin-primary);
  font-weight: 700;
}

.view-mode-toggles {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 0.25rem;
}

.toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--admin-radius-sm);
  border: none;
  background: transparent;
  color: var(--admin-text-muted);
  cursor: pointer;

  &:hover {
    color: var(--admin-text-primary);
  }

  &.active {
    background-color: var(--admin-primary);
    color: #ffffff;
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
}

.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-row {
  height: 3.25rem;
  border-radius: var(--admin-radius-md);
  background-color: var(--admin-bg-surface);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.2; }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  text-align: center;
}

.empty-icon {
  width: 3.5rem;
  height: 3.5rem;
  color: var(--admin-text-muted);
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0 0 0.5rem 0;
}

.empty-desc {
  font-size: 0.875rem;
  color: var(--admin-text-muted);
  margin: 0;
}

/* Table styling */
.table-responsive {
  width: 100%;
  overflow-x: auto;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  box-shadow: var(--admin-shadow-sm);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8125rem;
}

.data-table th {
  padding: 0.875rem 1rem;
  background-color: var(--admin-bg-app);
  color: var(--admin-text-muted);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--admin-border-color);
}

.data-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--admin-border-color);
  color: var(--admin-text-primary);
  vertical-align: middle;
}

.data-table tr {
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: var(--admin-bg-surface-hover);
  }

  &.is-selected {
    background-color: rgba(37, 99, 235, 0.08);
  }
}

.col-checkbox {
  width: 40px;
  text-align: center;
}

.font-mono {
  font-family: var(--admin-font-mono);
}

.col-id {
  font-size: 0.75rem;
  color: var(--admin-primary);
  font-weight: 600;
}

.title-cell {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.review-title {
  font-weight: 700;
  color: var(--admin-text-primary);
}

.owner-meta {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
}

.lang-tag {
  text-transform: capitalize;
  font-weight: 600;
  color: var(--admin-primary);
}

.model-cell {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.provider-name {
  font-weight: 700;
  color: var(--admin-text-primary);
}

.model-name {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
}

.text-muted {
  color: var(--admin-text-muted);
  font-size: 0.75rem;
}

.col-actions {
  width: 90px;
  text-align: right;
}

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.375rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-app);
  color: var(--admin-text-muted);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: var(--admin-primary);
    border-color: var(--admin-primary);
  }

  &.danger:hover {
    color: #ef4444;
    border-color: #ef4444;
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
}

/* Grid Layout */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

/* Pagination Footer */
.pagination-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  box-shadow: var(--admin-shadow-sm);
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ps-label {
  font-size: 0.8125rem;
  color: var(--admin-text-muted);
  font-weight: 500;
}

.ps-select {
  padding: 0.375rem 0.5rem;
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-app);
  color: var(--admin-text-primary);
  font-size: 0.8125rem;
  outline: none;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.page-btn {
  padding: 0.375rem 0.75rem;
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-app);
  color: var(--admin-text-primary);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--admin-primary);
    color: var(--admin-primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.page-info {
  font-size: 0.8125rem;
  color: var(--admin-text-secondary);

  strong {
    color: var(--admin-text-primary);
  }
}
</style>
