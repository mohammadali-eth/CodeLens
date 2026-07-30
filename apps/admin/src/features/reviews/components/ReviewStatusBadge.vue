<template>
  <span class="status-badge" :class="statusClass">
    <span class="status-dot"></span>
    <span class="status-label">{{ formattedLabel }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ReviewStatus } from '../models/review.model';

const props = defineProps<{
  status: ReviewStatus;
}>();

const statusClass = computed(() => {
  const s = String(props.status).toUpperCase();
  if (s === 'COMPLETED') return 'status-completed';
  if (s === 'PROCESSING') return 'status-processing';
  if (s === 'PENDING') return 'status-pending';
  if (s === 'FAILED') return 'status-failed';
  if (s === 'ARCHIVED') return 'status-archived';
  return 'status-unknown';
});

const formattedLabel = computed(() => {
  const s = String(props.status).toUpperCase();
  if (s === 'COMPLETED') return 'Completed';
  if (s === 'PROCESSING') return 'Processing';
  if (s === 'PENDING') return 'Pending';
  if (s === 'FAILED') return 'Failed';
  if (s === 'ARCHIVED') return 'Archived';
  return s;
});
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-completed {
  background-color: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.status-completed .status-dot {
  background-color: #10b981;
}

.status-processing {
  background-color: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}
.status-processing .status-dot {
  background-color: #3b82f6;
  animation: pulse 1.5s infinite;
}

.status-pending {
  background-color: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}
.status-pending .status-dot {
  background-color: #f59e0b;
}

.status-failed {
  background-color: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}
.status-failed .status-dot {
  background-color: #ef4444;
}

.status-archived {
  background-color: rgba(100, 116, 139, 0.12);
  color: #94a3b8;
}
.status-archived .status-dot {
  background-color: #94a3b8;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
