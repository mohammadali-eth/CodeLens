<script setup lang="ts">
import { reactive, watch } from 'vue';
import { GeneralSettings } from '../models/system-admin.model';

const props = defineProps<{
  settings: GeneralSettings | null;
  isSaving?: boolean;
}>();

const emit = defineEmits<{
  (e: 'save', updates: Partial<GeneralSettings>): void;
}>();

const form = reactive<GeneralSettings>({
  platformName: '',
  organizationName: '',
  defaultTimeZone: 'UTC',
  defaultLanguage: 'en-US',
  logoUrl: '',
  faviconUrl: '',
  primaryColorHex: '#3b82f6',
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
      <h3 class="panel-title">General Platform Settings</h3>
      <p class="panel-subtitle">Configure system title, organization details, default language, and branding theme.</p>
    </div>

    <form @submit.prevent="handleSave" class="settings-form">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Platform Name</label>
          <input v-model="form.platformName" type="text" class="form-input" required />
          <span class="form-hint">Displayed on page headers, metadata, and automated email footers.</span>
        </div>

        <div class="form-group">
          <label class="form-label">Organization Name</label>
          <input v-model="form.organizationName" type="text" class="form-input" required />
          <span class="form-hint">Legal organization name for audit logs and licensing.</span>
        </div>

        <div class="form-group">
          <label class="form-label">Default Time Zone</label>
          <select v-model="form.defaultTimeZone" class="form-select">
            <option value="UTC (Coordinated Universal Time)">UTC (Coordinated Universal Time)</option>
            <option value="America/New_York (EST)">America/New_York (EST)</option>
            <option value="Europe/London (GMT)">Europe/London (GMT)</option>
            <option value="Asia/Tokyo (JST)">Asia/Tokyo (JST)</option>
            <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Default Language</label>
          <select v-model="form.defaultLanguage" class="form-select">
            <option value="en-US">English (United States)</option>
            <option value="es-ES">Spanish (Español)</option>
            <option value="fr-FR">French (Français)</option>
            <option value="de-DE">German (Deutsch)</option>
            <option value="ja-JP">Japanese (日本語)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Primary Brand Color</label>
          <div class="color-picker-box">
            <input v-model="form.primaryColorHex" type="color" class="color-picker" />
            <input v-model="form.primaryColorHex" type="text" class="form-input hex-input" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Logo Asset URL</label>
          <input v-model="form.logoUrl" type="text" class="form-input" placeholder="https://cdn.example.com/logo.svg" />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="save-btn" :disabled="isSaving">
          <span v-if="isSaving">Saving...</span>
          <span v-else>Save General Settings</span>
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
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; @media (max-width: 768px) { grid-template-columns: 1fr; } }

.form-group { display: flex; flex-direction: column; gap: 0.35rem; }
.form-label { font-size: 0.82rem; font-weight: 600; color: var(--admin-text-secondary, #334155); }
.form-hint { font-size: 0.75rem; color: var(--admin-text-muted, #64748b); }

.form-input, .form-select {
  padding: 0.55rem 0.85rem;
  border-radius: var(--admin-radius-sm, 6px);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  background: var(--admin-bg-surface-hover, #f8fafc);
  color: var(--admin-text-primary, #0f172a);
  font-size: 0.88rem;
  &:focus { outline: none; border-color: var(--admin-primary, #2563eb); }
}

.color-picker-box { display: flex; gap: 0.5rem; align-items: center; }
.color-picker { width: 40px; height: 38px; border: none; cursor: pointer; background: transparent; }
.hex-input { flex: 1; }

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
