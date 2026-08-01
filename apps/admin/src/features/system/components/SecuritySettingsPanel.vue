<script setup lang="ts">
import { reactive, watch } from 'vue';
import { SecuritySettings } from '../models/system-admin.model';

const props = defineProps<{
  settings: SecuritySettings | null;
  isSaving?: boolean;
}>();

const emit = defineEmits<{
  (e: 'save', updates: Partial<SecuritySettings>): void;
}>();

const form = reactive<SecuritySettings>({
  minPasswordLength: 12,
  requireSpecialChar: true,
  requireNumbers: true,
  requireUppercase: true,
  sessionTimeoutMinutes: 60,
  maxLoginAttempts: 5,
  lockoutDurationMinutes: 15,
  jwtExpiration: '24h',
  allowedOrigins: ['http://localhost:3000', 'http://localhost:5173'],
});

watch(
  () => props.settings,
  (val) => {
    if (val) {
      Object.assign(form, val);
    }
  },
  { immediate: true, deep: true }
);

const handleSave = () => {
  emit('save', { ...form });
};
</script>

<template>
  <div class="panel-card">
    <div class="panel-header">
      <h3 class="panel-title">Security & Governance Settings</h3>
      <p class="panel-subtitle">Manage administrative password complexity policies, session idle timeouts, rate limits, and CORS origins.</p>
    </div>

    <form @submit.prevent="handleSave" class="settings-form">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Minimum Password Length</label>
          <input v-model.number="form.minPasswordLength" type="number" min="8" max="64" class="form-input" required />
        </div>

        <div class="form-group">
          <label class="form-label">Max Failed Login Attempts</label>
          <input v-model.number="form.maxLoginAttempts" type="number" min="3" max="20" class="form-input" required />
        </div>

        <div class="form-group">
          <label class="form-label">Session Idle Timeout (Minutes)</label>
          <input v-model.number="form.sessionTimeoutMinutes" type="number" min="5" max="1440" class="form-input" required />
        </div>

        <div class="form-group">
          <label class="form-label">Lockout Duration (Minutes)</label>
          <input v-model.number="form.lockoutDurationMinutes" type="number" min="5" max="1440" class="form-input" required />
        </div>

        <div class="form-group full-width">
          <label class="form-label">Password Requirement Rules</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.requireSpecialChar" />
              Require Special Characters (!@#$%^&*)
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.requireNumbers" />
              Require Numbers (0-9)
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.requireUppercase" />
              Require Uppercase Letters (A-Z)
            </label>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="save-btn" :disabled="isSaving">
          <span v-if="isSaving">Updating Security Policy...</span>
          <span v-else>Save Security Settings</span>
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
}

.panel-header { margin-bottom: 1.5rem; }
.panel-title { font-size: 1.2rem; font-weight: 700; color: var(--admin-text-primary, #0f172a); margin: 0; }
.panel-subtitle { font-size: 0.85rem; color: var(--admin-text-muted, #64748b); margin-top: 0.2rem; }

.settings-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.full-width { grid-column: span 2; }

.form-group { display: flex; flex-direction: column; gap: 0.35rem; }
.form-label { font-size: 0.82rem; font-weight: 600; color: var(--admin-text-secondary, #334155); }

.form-input {
  padding: 0.55rem 0.85rem;
  border-radius: var(--admin-radius-sm, 6px);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  background: var(--admin-bg-surface-hover, #f8fafc);
  color: var(--admin-text-primary, #0f172a);
  font-size: 0.88rem;
  &:focus { outline: none; border-color: var(--admin-primary, #2563eb); }
}

.checkbox-group { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.4rem; }
.checkbox-label { font-size: 0.85rem; color: var(--admin-text-secondary, #334155); display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }

.form-actions { display: flex; justify-content: flex-end; pt: 1rem; border-top: 1px solid var(--admin-border-color, #e2e8f0); }
.save-btn {
  background: var(--admin-primary, #2563eb);
  color: #ffffff;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: var(--admin-radius-sm, 6px);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  &:hover:not(:disabled) { background: var(--admin-primary-hover, #1d4ed8); }
}
</style>
