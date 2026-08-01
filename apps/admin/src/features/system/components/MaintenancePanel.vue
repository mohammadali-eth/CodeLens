<script setup lang="ts">
import { reactive, watch } from 'vue';
import { MaintenanceConfig } from '../models/system-admin.model';

const props = defineProps<{
  config: MaintenanceConfig | null;
  isSaving?: boolean;
}>();

const emit = defineEmits<{
  (e: 'save', updates: Partial<MaintenanceConfig>): void;
}>();

const form = reactive<MaintenanceConfig>({
  isMaintenanceEnabled: false,
  message: 'CodeLens is currently undergoing scheduled platform upgrades. We will be back online shortly.',
  allowedIpAddresses: ['127.0.0.1'],
  allowedRoles: ['SUPER_ADMIN'],
  scheduledStartAt: null,
  scheduledEndAt: null,
});

watch(
  () => props.config,
  (val) => {
    if (val) Object.assign(form, val);
  },
  { immediate: true, deep: true }
);

const handleSave = () => {
  emit('save', { ...form });
};
</script>

<template>
  <div class="panel-card" :class="{ 'in-maintenance': form.isMaintenanceEnabled }">
    <div class="panel-header">
      <div class="header-text">
        <h3 class="panel-title">Platform Maintenance Mode Control</h3>
        <p class="panel-subtitle">Lockdown system traffic for zero-downtime upgrades, display maintenance banners, and define bypass rules.</p>
      </div>

      <div class="toggle-box">
        <span class="toggle-text">{{ form.isMaintenanceEnabled ? 'MAINTENANCE MODE ACTIVE' : 'SYSTEM OPERATIONAL' }}</span>
        <label class="switch-toggle">
          <input type="checkbox" v-model="form.isMaintenanceEnabled" />
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="settings-form">
      <div class="form-group">
        <label class="form-label">Maintenance Banner Message for Users</label>
        <textarea v-model="form.message" rows="3" class="form-textarea" required></textarea>
      </div>

      <div class="form-actions">
        <button type="submit" class="save-btn" :disabled="isSaving">
          <span v-if="isSaving">Updating Maintenance Config...</span>
          <span v-else>Save Maintenance Mode</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.panel-card {
  background: var(--admin-bg-surface, #ffffff);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-radius-md, 10px);
  padding: 1.5rem;
  box-shadow: var(--admin-shadow-sm);
  &.in-maintenance { border-color: var(--admin-warning, #f59e0b); }
}

.panel-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
.panel-title { font-size: 1.2rem; font-weight: 700; color: var(--admin-text-primary, #0f172a); margin: 0; }
.panel-subtitle { font-size: 0.85rem; color: var(--admin-text-muted, #64748b); margin-top: 0.2rem; }

.toggle-box { display: flex; align-items: center; gap: 0.75rem; }
.toggle-text { font-size: 0.78rem; font-weight: 800; color: var(--admin-warning, #f59e0b); }

.switch-toggle {
  position: relative; display: inline-block; width: 44px; height: 24px;
  input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
    background-color: #cbd5e1; transition: .3s; border-radius: 24px;
    &:before {
      position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
      background-color: white; transition: .3s; border-radius: 50%;
    }
  }
  input:checked + .slider { background-color: var(--admin-warning, #f59e0b); }
  input:checked + .slider:before { transform: translateX(20px); }
}

.settings-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.35rem; }
.form-label { font-size: 0.82rem; font-weight: 600; color: var(--admin-text-secondary, #334155); }

.form-textarea {
  padding: 0.75rem; border-radius: var(--admin-radius-sm, 6px);
  border: 1px solid var(--admin-border-color, #e2e8f0); background: var(--admin-bg-surface-hover, #f8fafc);
  color: var(--admin-text-primary, #0f172a); font-size: 0.88rem; font-family: inherit;
  &:focus { outline: none; border-color: var(--admin-primary, #2563eb); }
}

.form-actions { display: flex; justify-content: flex-end; }
.save-btn {
  background: var(--admin-primary, #2563eb); color: #ffffff; border: none;
  padding: 0.6rem 1.25rem; border-radius: var(--admin-radius-sm, 6px); font-size: 0.85rem; font-weight: 600; cursor: pointer;
}
</style>
