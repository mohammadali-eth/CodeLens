<template>
  <div v-if="selectedCount > 0" class="bulk-toolbar-floating">
    <div class="toolbar-content">
      <div class="selection-count">
        <span class="count-badge">{{ selectedCount }}</span>
        <span class="count-label">User{{ selectedCount > 1 ? 's' : '' }} Selected</span>
      </div>

      <div class="toolbar-divider"></div>

      <div class="action-buttons">
        <button
          class="btn-action success"
          @click="onTrigger('activate')"
          :disabled="isExecuting"
          title="Activate selected accounts"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>Bulk Activate</span>
        </button>

        <button
          class="btn-action warning"
          @click="onTrigger('suspend')"
          :disabled="isExecuting"
          title="Suspend selected accounts"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="10" y1="15" x2="10" y2="9"></line>
            <line x1="14" y1="15" x2="14" y2="9"></line>
          </svg>
          <span>Bulk Suspend</span>
        </button>

        <button
          class="btn-action default"
          @click="onTrigger('reset_password')"
          :disabled="isExecuting"
          title="Reset passwords"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Reset Passwords</span>
        </button>

        <button
          class="btn-action danger"
          @click="onTrigger('delete')"
          :disabled="isExecuting"
          title="Soft-delete selected accounts"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span>Bulk Delete</span>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <button class="btn-clear" @click="$emit('clear-selection')" title="Deselect all">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span>Clear</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BulkUserActionType } from '../../../models';

defineProps<{
  selectedCount: number;
  isExecuting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'execute-action', payload: { action: BulkUserActionType; reason?: string }): void;
  (e: 'clear-selection'): void;
}>();

function onTrigger(action: BulkUserActionType) {
  let reason: string | undefined = undefined;
  if (action === 'suspend' || action === 'delete') {
    const input = prompt(`Enter administrative audit reason for bulk ${action} action:`);
    if (input === null) return; // User canceled prompt
    reason = input.trim();
  }
  emit('execute-action', { action, reason });
}
</script>

<style scoped>
.bulk-toolbar-floating {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 900;
  animation: slideUp 0.25s ease-out;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

.toolbar-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-primary);
  border-radius: var(--admin-radius-full);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(37, 99, 235, 0.25);
  backdrop-filter: blur(8px);
}

.selection-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.count-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.375rem;
  border-radius: 12px;
  background-color: var(--admin-primary);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
}

.count-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  white-space: nowrap;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background-color: var(--admin-border-color);
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.75rem;
  border-radius: var(--admin-radius-md);
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-action.success {
  background-color: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.3);
}

.btn-action.success:not(:disabled):hover {
  background-color: #10b981;
  color: #ffffff;
}

.btn-action.warning {
  background-color: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
}

.btn-action.warning:not(:disabled):hover {
  background-color: #f59e0b;
  color: #ffffff;
}

.btn-action.danger {
  background-color: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.btn-action.danger:not(:disabled):hover {
  background-color: #ef4444;
  color: #ffffff;
}

.btn-action.default {
  background-color: var(--admin-bg-app);
  color: var(--admin-text-primary);
  border-color: var(--admin-border-color);
}

.btn-action.default:not(:disabled):hover {
  border-color: var(--admin-primary);
  color: var(--admin-primary);
}

.btn-clear {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: var(--admin-text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: var(--admin-radius-md);
  transition: all 0.15s ease;
}

.btn-clear:hover {
  color: var(--admin-text-primary);
  background-color: var(--admin-bg-app);
}
</style>
