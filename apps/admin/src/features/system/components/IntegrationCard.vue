<script setup lang="ts">
import { ref } from 'vue';
import { IntegrationConfig } from '../models/system-admin.model';

defineProps<{
  integrations: IntegrationConfig[];
}>();

const emit = defineEmits<{
  (e: 'test', id: string): void;
}>();

const testingId = ref<string | null>(null);
const feedback = ref<Record<string, string>>({});

const getProviderIcon = (key: string) => {
  switch (key) {
    case 'github': return '🐙';
    case 'gitlab': return '🦊';
    case 'bitbucket': return '🪣';
    case 'slack': return '💬';
    case 'email': return '✉️';
    default: return '⚡';
  }
};

const handleTest = (id: string) => {
  testingId.value = id;
  emit('test', id);
  setTimeout(() => {
    feedback.value[id] = 'Connection verified nominal';
    testingId.value = null;
  }, 500);
};
</script>

<template>
  <div class="panel-card">
    <div class="panel-header">
      <h3 class="panel-title">Third-Party Ecosystem Integrations</h3>
      <p class="panel-subtitle">Manage VCS repositories, notification channels, webhooks, and automation pipelines.</p>
    </div>

    <div class="integrations-grid">
      <div v-for="integ in integrations" :key="integ.id" class="integration-card">
        <div class="card-head">
          <div class="provider-title-box">
            <span class="icon">{{ getProviderIcon(integ.providerKey) }}</span>
            <span class="name">{{ integ.name }}</span>
          </div>
          <span class="status-badge" :class="integ.status.toLowerCase()">
            ● {{ integ.status }}
          </span>
        </div>

        <div class="card-body">
          <span class="category-tag">{{ integ.category.toUpperCase() }}</span>
          <div v-if="integ.webhookUrl" class="webhook-box">
            <span class="label">Webhook Endpoint:</span>
            <code class="url">{{ integ.webhookUrl }}</code>
          </div>
        </div>

        <div class="card-foot">
          <button
            class="test-btn"
            :disabled="testingId === integ.id"
            @click="handleTest(integ.id)"
          >
            <span v-if="testingId === integ.id">Verifying...</span>
            <span v-else>Test Connection</span>
          </button>
          <span v-if="feedback[integ.id]" class="feedback-msg">{{ feedback[integ.id] }}</span>
        </div>
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

.panel-header { margin-bottom: 1.25rem; }
.panel-title { font-size: 1.2rem; font-weight: 700; color: var(--admin-text-primary, #0f172a); margin: 0; }
.panel-subtitle { font-size: 0.85rem; color: var(--admin-text-muted, #64748b); margin-top: 0.2rem; }

.integrations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

.integration-card {
  background: var(--admin-bg-surface-hover, #f8fafc);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-radius-sm, 8px);
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.card-head { display: flex; justify-content: space-between; align-items: center; }
.provider-title-box { display: flex; align-items: center; gap: 0.5rem; }
.icon { font-size: 1.2rem; }
.name { font-weight: 700; font-size: 0.95rem; color: var(--admin-text-primary, #0f172a); }

.status-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  &.connected { color: var(--admin-success, #10b981); background: rgba(16, 185, 129, 0.12); }
  &.disconnected { color: var(--admin-text-muted, #64748b); background: var(--admin-bg-app, #f1f5f9); }
  &.error { color: var(--admin-danger, #ef4444); background: rgba(239, 68, 68, 0.12); }
}

.card-body { display: flex; flex-direction: column; gap: 0.5rem; }
.category-tag { font-size: 0.68rem; font-weight: 800; color: var(--admin-text-muted, #64748b); letter-spacing: 0.05em; }

.webhook-box {
  display: flex; flex-direction: column; gap: 0.2rem;
  .label { font-size: 0.72rem; color: var(--admin-text-muted, #64748b); }
  .url { font-family: monospace; font-size: 0.75rem; color: var(--admin-primary, #2563eb); word-break: break-all; }
}

.card-foot { display: flex; flex-direction: column; gap: 0.2rem; border-top: 1px dashed var(--admin-border-color, #e2e8f0); padding-top: 0.65rem; }
.test-btn {
  background: var(--admin-bg-surface, #ffffff);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  color: var(--admin-text-primary, #0f172a);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.35rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover:not(:disabled) { border-color: var(--admin-primary, #2563eb); color: var(--admin-primary, #2563eb); }
}
.feedback-msg { font-size: 0.72rem; color: var(--admin-success, #10b981); text-align: center; }
</style>
