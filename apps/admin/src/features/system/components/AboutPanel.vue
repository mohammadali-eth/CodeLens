<script setup lang="ts">
import { PlatformAboutInfo } from '../models/system-admin.model';

defineProps<{
  about: PlatformAboutInfo | null;
}>();
</script>

<template>
  <div class="panel-card">
    <div class="panel-header">
      <h3 class="panel-title">About CodeLens Enterprise Architecture</h3>
      <p class="panel-subtitle">Operational platform release metadata, license entitlement, build hashes, and system runtime information.</p>
    </div>

    <div v-if="!about" class="empty-state">
      <p>Platform release metadata unavailable.</p>
    </div>

    <div v-else class="about-grid">
      <div class="about-card">
        <span class="label">System Version</span>
        <span class="val highlight">{{ about.version }}</span>
      </div>

      <div class="about-card">
        <span class="label">Build Hash</span>
        <code class="val code-val">{{ about.buildHash }}</code>
      </div>

      <div class="about-card">
        <span class="label">License Tier</span>
        <span class="val">{{ about.licenseType }}</span>
      </div>

      <div class="about-card">
        <span class="label">Licensed To</span>
        <span class="val">{{ about.licensedTo }}</span>
      </div>

      <div class="about-card">
        <span class="label">Target Environment</span>
        <span class="val env-tag">{{ about.environment.toUpperCase() }}</span>
      </div>

      <div class="about-card">
        <span class="label">Runtime Node Engine</span>
        <span class="val">{{ about.nodeVersion }}</span>
      </div>
    </div>
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

.about-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }

.about-card {
  background: var(--admin-bg-surface-hover, #f8fafc);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-radius-sm, 8px);
  padding: 1rem;
  display: flex; flex-direction: column; gap: 0.35rem;

  .label { font-size: 0.78rem; font-weight: 600; color: var(--admin-text-muted, #64748b); text-transform: uppercase; }
  .val { font-size: 1.05rem; font-weight: 700; color: var(--admin-text-primary, #0f172a); }
  .highlight { color: var(--admin-primary, #2563eb); }
  .code-val { font-family: monospace; font-size: 0.88rem; }
  .env-tag { color: var(--admin-success, #10b981); }
}

.empty-state { padding: 2rem; text-align: center; color: var(--admin-text-muted, #64748b); }
</style>
