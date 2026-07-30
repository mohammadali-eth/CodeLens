<template>
  <div class="moderator-panel">
    <div class="panel-header">
      <h4 class="panel-title">Review Governance & Moderation</h4>
      <span v-if="review.isFlagged" class="flagged-indicator">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 2v19h2v-6h11l-1-4 1-4H5V2H3z"/></svg>
        Flagged by Administrator
      </span>
    </div>

    <div class="moderation-controls">
      <!-- Flag Toggle -->
      <div class="control-card">
        <div class="control-info">
          <span class="control-name">Flag Review</span>
          <span class="control-desc">Mark review for security or compliance inspection.</span>
        </div>
        <button
          type="button"
          class="btn-toggle"
          :class="{ active: isFlagged }"
          @click="toggleFlag"
        >
          {{ isFlagged ? 'Flagged' : 'Flag' }}
        </button>
      </div>

      <!-- Visibility Toggle -->
      <div class="control-card">
        <div class="control-info">
          <span class="control-name">Hide Visibility</span>
          <span class="control-desc">Hide this review from standard tenant developer feeds.</span>
        </div>
        <button
          type="button"
          class="btn-toggle"
          :class="{ active: isHidden }"
          @click="toggleHidden"
        >
          {{ isHidden ? 'Hidden' : 'Visible' }}
        </button>
      </div>

      <!-- Notes Textarea -->
      <div class="notes-group">
        <label class="notes-label">Administrative & Moderation Notes</label>
        <textarea
          v-model="notes"
          rows="4"
          placeholder="Enter administrative notes, compliance warnings, or inspection reasons..."
          class="notes-textarea"
        ></textarea>
      </div>

      <!-- Save Button -->
      <div class="action-row">
        <button
          type="button"
          class="btn-save"
          :disabled="isSaving"
          @click="saveModeration"
        >
          {{ isSaving ? 'Saving Notes...' : 'Save Moderation Settings' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { AdminReviewDetail } from '../models/review.model';

const props = defineProps<{
  review: AdminReviewDetail;
  isSaving?: boolean;
}>();

const emit = defineEmits<{
  (e: 'save', payload: { isFlagged: boolean; isHidden: boolean; moderatorNotes: string }): void;
}>();

const isFlagged = ref(!!props.review.isFlagged);
const isHidden = ref(!!props.review.isHidden);
const notes = ref(props.review.moderatorNotes || '');

watch(
  () => props.review,
  (rev) => {
    isFlagged.value = !!rev.isFlagged;
    isHidden.value = !!rev.isHidden;
    notes.value = rev.moderatorNotes || '';
  },
  { deep: true }
);

function toggleFlag() {
  isFlagged.value = !isFlagged.value;
}

function toggleHidden() {
  isHidden.value = !isHidden.value;
}

function saveModeration() {
  emit('save', {
    isFlagged: isFlagged.value,
    isHidden: isHidden.value,
    moderatorNotes: notes.value,
  });
}
</script>

<style scoped>
.moderator-panel {
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--admin-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.flagged-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 700;

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
}

.moderation-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.control-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
}

.control-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.control-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}

.control-desc {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
}

.btn-toggle {
  padding: 0.375rem 0.875rem;
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-app);
  color: var(--admin-text-muted);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;

  &.active {
    background-color: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border-color: #ef4444;
  }
}

.notes-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.notes-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--admin-text-muted);
}

.notes-textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-surface);
  color: var(--admin-text-primary);
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--admin-primary);
  }
}

.action-row {
  display: flex;
  justify-content: flex-end;
}

.btn-save {
  padding: 0.625rem 1.25rem;
  border-radius: var(--admin-radius-md);
  border: none;
  background-color: var(--admin-primary);
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: var(--admin-primary-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
