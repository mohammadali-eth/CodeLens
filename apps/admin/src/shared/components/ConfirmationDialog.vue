<template>
  <div v-if="isOpen" class="dialog-backdrop" @click.self="handleCancel">
    <div class="dialog-card animate-fade-in" role="dialog" aria-modal="true" :aria-labelledby="titleId">
      <div class="dialog-header">
        <h3 :id="titleId" class="dialog-title">{{ title }}</h3>
      </div>
      <div class="dialog-body">
        <p class="dialog-message">{{ message }}</p>
      </div>
      <div class="dialog-footer">
        <button class="btn btn-secondary" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button class="btn" :class="confirmBtnClass" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'primary',
});

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const titleId = `dialog_title_${Math.random().toString(36).substring(2, 9)}`;

const confirmBtnClass = computed(() => {
  if (props.variant === 'danger') return 'btn-danger';
  if (props.variant === 'warning') return 'btn-warning';
  return 'btn-primary';
});

function handleConfirm() {
  emit('confirm');
}

function handleCancel() {
  emit('cancel');
}
</script>

<style scoped>
.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}
.dialog-card {
  width: 100%;
  max-width: 440px;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
.dialog-header {
  padding: 1.25rem 1.5rem 0.5rem 1.5rem;
}
.dialog-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}
.dialog-body {
  padding: 0.5rem 1.5rem 1.25rem 1.5rem;
}
.dialog-message {
  margin: 0;
  font-size: 0.875rem;
  color: var(--admin-text-secondary);
  line-height: 1.5;
}
.dialog-footer {
  padding: 1rem 1.5rem;
  background-color: var(--admin-bg-app);
  border-top: 1px solid var(--admin-border-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}
.btn {
  padding: 0.5rem 1rem;
  border-radius: var(--admin-radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}
.btn-secondary {
  background-color: var(--admin-bg-surface);
  border-color: var(--admin-border-color);
  color: var(--admin-text-primary);
}
.btn-secondary:hover {
  background-color: var(--admin-bg-app);
}
.btn-primary {
  background-color: var(--admin-primary);
  color: #ffffff;
}
.btn-primary:hover {
  background-color: var(--admin-primary-hover);
}
.btn-danger {
  background-color: #ef4444;
  color: #ffffff;
}
.btn-danger:hover {
  background-color: #dc2626;
}
.btn-warning {
  background-color: #f59e0b;
  color: #ffffff;
}
</style>
