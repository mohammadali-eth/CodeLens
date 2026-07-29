<template>
  <span class="role-badge" :class="roleClass">
    {{ roleLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { UserRole } from '../../../models';

interface Props {
  role?: UserRole | string;
}

const props = defineProps<Props>();

const roleClass = computed(() => {
  const r = props.role?.toUpperCase();
  if (r === UserRole.SUPER_ADMIN) return 'super-admin';
  if (r === UserRole.ADMIN) return 'admin';
  if (r === UserRole.MODERATOR) return 'moderator';
  if (r === UserRole.AUDITOR) return 'auditor';
  return 'default';
});

const roleLabel = computed(() => {
  return props.role ? props.role.replace('_', ' ') : 'USER';
});
</script>

<style scoped>
.role-badge {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
}
.role-badge.super-admin {
  background-color: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
}
.role-badge.admin {
  background-color: rgba(37, 99, 235, 0.15);
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.3);
}
.role-badge.moderator {
  background-color: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}
.role-badge.auditor {
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.role-badge.default {
  background-color: rgba(100, 116, 139, 0.15);
  color: #64748b;
  border: 1px solid rgba(100, 116, 139, 0.3);
}
</style>
