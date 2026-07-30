<template>
  <span class="status-badge" :class="statusClass">
    <span class="status-dot"></span>
    <span class="status-label">{{ formattedLabel }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { UserStatus } from '../../../models';

const props = defineProps<{
  status: UserStatus;
}>();

const statusClass = computed(() => {
  const s = String(props.status).toUpperCase();
  if (s === 'ACTIVE') return 'status-active';
  if (s === 'SUSPENDED') return 'status-suspended';
  if (s === 'PENDING' || s === 'PENDING_VERIFICATION' || s === 'UNVERIFIED') return 'status-pending';
  if (s === 'DELETED') return 'status-deleted';
  return 'status-inactive';
});

const formattedLabel = computed(() => {
  const s = String(props.status).toUpperCase();
  if (s === 'PENDING_VERIFICATION') return 'Pending Verification';
  if (s === 'UNVERIFIED') return 'Unverified';
  return s.charAt(0) + s.slice(1).toLowerCase();
});
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: var(--admin-radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-active {
  background-color: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.status-active .status-dot {
  background-color: #10b981;
}

.status-suspended {
  background-color: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}
.status-suspended .status-dot {
  background-color: #ef4444;
}

.status-pending {
  background-color: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}
.status-pending .status-dot {
  background-color: #f59e0b;
}

.status-inactive {
  background-color: rgba(100, 116, 139, 0.12);
  color: #94a3b8;
}
.status-inactive .status-dot {
  background-color: #94a3b8;
}

.status-deleted {
  background-color: rgba(239, 68, 68, 0.18);
  color: #fca5a5;
  text-decoration: line-through;
}
.status-deleted .status-dot {
  background-color: #ef4444;
}
</style>
