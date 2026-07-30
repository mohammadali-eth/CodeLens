<template>
  <div class="permission-matrix-container">
    <div v-for="group in groups" :key="group.module" class="matrix-group">
      <div class="group-header">
        <span class="group-title">{{ group.label }}</span>
        <span class="permission-count">{{ getGrantedCount(group) }} / {{ group.permissions.length }} Granted</span>
      </div>

      <div class="permissions-grid">
        <div
          v-for="perm in group.permissions"
          :key="perm.id"
          class="permission-card"
          :class="{ 'is-granted': perm.granted, 'is-editable': editable }"
          @click="togglePermission(group.module, perm.id)"
        >
          <div class="perm-checkbox">
            <svg v-if="perm.granted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div class="perm-info">
            <span class="perm-label">{{ perm.label }}</span>
            <span class="perm-desc">{{ perm.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ModulePermissionsGroup } from '../../../models';

const props = withDefaults(
  defineProps<{
    groups: ModulePermissionsGroup[];
    editable?: boolean;
  }>(),
  {
    editable: false,
  }
);

const emit = defineEmits<{
  (e: 'toggle-permission', payload: { module: string; permissionId: string }): void;
}>();

function getGrantedCount(group: ModulePermissionsGroup): number {
  return group.permissions.filter((p) => p.granted).length;
}

function togglePermission(module: string, permissionId: string) {
  if (props.editable) {
    emit('toggle-permission', { module, permissionId });
  }
}
</script>

<style scoped>
.permission-matrix-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.matrix-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1rem 1.25rem;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--admin-border-color);
  padding-bottom: 0.5rem;
}

.group-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}

.permission-count {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
  font-weight: 600;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.permission-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  transition: all 0.15s ease;
  user-select: none;
}

.permission-card.is-editable {
  cursor: pointer;
}

.permission-card.is-granted {
  border-color: rgba(37, 99, 235, 0.4);
  background-color: rgba(37, 99, 235, 0.05);
}

.perm-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid var(--admin-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  color: #ffffff;
  background-color: var(--admin-bg-app);
}

.permission-card.is-granted .perm-checkbox {
  background-color: var(--admin-primary);
  border-color: var(--admin-primary);
}

.perm-info {
  display: flex;
  flex-direction: column;
}

.perm-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}

.perm-desc {
  font-size: 0.6875rem;
  color: var(--admin-text-muted);
  margin-top: 0.125rem;
  line-height: 1.3;
}
</style>
