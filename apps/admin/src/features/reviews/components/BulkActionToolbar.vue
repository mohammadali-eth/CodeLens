<template>
  <Transition name="slide-up">
    <div v-if="store.hasSelectedReviews" class="bulk-toolbar-container">
      <div class="bulk-toolbar">
        <div class="selection-info">
          <span class="badge-count">{{ store.selectedReviewsCount }}</span>
          <span class="selection-label">reviews selected</span>
          <button type="button" class="btn-link" @click="store.clearSelection">Clear</button>
        </div>

        <div class="action-buttons">
          <!-- Batch Re-run -->
          <div class="rerun-group">
            <select v-model="rerunProvider" class="provider-dropdown">
              <option value="">Keep Original Model</option>
              <option value="GEMINI">Google Gemini</option>
              <option value="OPENAI">OpenAI GPT-4o</option>
              <option value="ANTHROPIC">Anthropic Claude</option>
              <option value="DEEPSEEK">DeepSeek R1</option>
            </select>
            <button
              type="button"
              class="bulk-btn btn-rerun"
              :disabled="store.isActionLoading"
              @click="handleBulkAction('rerun')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Batch Re-run
            </button>
          </div>

          <!-- Batch Archive -->
          <button
            type="button"
            class="bulk-btn btn-archive"
            :disabled="store.isActionLoading"
            @click="handleBulkAction('archive')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
            Archive
          </button>

          <!-- Batch Restore -->
          <button
            type="button"
            class="bulk-btn btn-restore"
            :disabled="store.isActionLoading"
            @click="handleBulkAction('restore')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Restore
          </button>

          <!-- Batch Export -->
          <button
            type="button"
            class="bulk-btn btn-export"
            :disabled="store.isActionLoading"
            @click="handleBulkAction('export')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Export Reports
          </button>

          <!-- Batch Delete -->
          <button
            type="button"
            class="bulk-btn btn-delete"
            :disabled="store.isActionLoading"
            @click="confirmDelete"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useReviewsStore } from '../../../stores/reviews.store';
import { BulkReviewActionType } from '../models/review.model';

const store = useReviewsStore();
const rerunProvider = ref<string>('');

const emit = defineEmits<{
  (e: 'action-completed', message: string): void;
}>();

async function handleBulkAction(action: BulkReviewActionType) {
  try {
    const result = await store.executeBulkAction(action, {
      aiProvider: rerunProvider.value || undefined,
    });
    if (result) {
      emit('action-completed', result.message);
    }
  } catch {
    // Handled in store
  }
}

function confirmDelete() {
  if (confirm(`Are you sure you want to delete ${store.selectedReviewsCount} code reviews? This action cannot be undone.`)) {
    handleBulkAction('delete');
  }
}
</script>

<style scoped>
.bulk-toolbar-container {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 90;
  width: max-content;
  max-width: 90vw;
}

.bulk-toolbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1.25rem;
  background-color: #0f172a;
  border: 1px solid #3b82f6;
  border-radius: 9999px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(8px);
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.badge-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.375rem;
  border-radius: 9999px;
  background-color: #3b82f6;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
}

.selection-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #f8fafc;
}

.btn-link {
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 0.75rem;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #f8fafc;
  }
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rerun-group {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.provider-dropdown {
  padding: 0.375rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #334155;
  background-color: #1e293b;
  color: #f8fafc;
  font-size: 0.75rem;
  outline: none;
}

.bulk-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid transparent;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
}

.btn-rerun {
  background-color: #3b82f6;
  color: #ffffff;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }
}

.btn-archive, .btn-restore, .btn-export {
  background-color: #1e293b;
  color: #f8fafc;
  border-color: #334155;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    color: #60a5fa;
  }
}

.btn-delete {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);

  &:hover:not(:disabled) {
    background-color: #ef4444;
    color: #ffffff;
  }
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}
</style>
