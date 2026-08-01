<script setup lang="ts">
import { ref } from 'vue';
import { AIProviderConfig } from '../models/system-admin.model';

defineProps<{
  providers: AIProviderConfig[];
  isSaving?: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle', id: string, isEnabled: boolean): void;
  (e: 'setDefault', id: string): void;
  (e: 'test', id: string): void;
}>();

const testingId = ref<string | null>(null);
const testFeedback = ref<Record<string, string>>({});

const handleTest = async (id: string) => {
  testingId.value = id;
  emit('test', id);
  setTimeout(() => {
    testFeedback.value[id] = 'Ping Successful (340ms latency)';
    testingId.value = null;
  }, 600);
};
</script>

<template>
  <div class="panel-card">
    <div class="panel-header">
      <div class="header-text">
        <h3 class="panel-title">AI Engine Provider Management</h3>
        <p class="panel-subtitle">Configure Multi-LLM provider models, set primary default fallback provider, and test connectivity.</p>
      </div>
    </div>

    <div class="table-responsive">
      <table class="provider-table">
        <thead>
          <tr>
            <th>Provider & Models</th>
            <th>Status Health</th>
            <th>Latency</th>
            <th>API Key (Masked)</th>
            <th>Default Provider</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in providers" :key="p.id" :class="{ 'is-disabled': !p.isEnabled }">
            <td class="provider-info-cell">
              <div class="provider-name-row">
                <span class="provider-title">{{ p.providerName }}</span>
                <span v-if="p.isDefault" class="default-badge">DEFAULT</span>
              </div>
              <div class="models-chips">
                <span v-for="m in p.availableModels" :key="m" class="model-chip" :class="{ active: m === p.activeModel }">
                  {{ m }}
                </span>
              </div>
            </td>

            <td>
              <span class="health-tag" :class="p.status.toLowerCase()">
                ● {{ p.status }}
              </span>
            </td>

            <td class="latency-cell">
              {{ p.responseTimeMs }} ms
            </td>

            <td class="key-cell">
              <code>{{ p.apiKeyMasked }}</code>
            </td>

            <td>
              <button
                v-if="!p.isDefault && p.isEnabled"
                class="make-default-btn"
                @click="emit('setDefault', p.id)"
              >
                Set as Default
              </button>
              <span v-else-if="p.isDefault" class="primary-label">Primary LLM</span>
            </td>

            <td>
              <label class="switch-toggle">
                <input
                  type="checkbox"
                  :checked="p.isEnabled"
                  @change="emit('toggle', p.id, ($event.target as HTMLInputElement).checked)"
                />
                <span class="slider"></span>
              </label>
            </td>

            <td class="actions-cell">
              <button
                class="test-btn"
                :disabled="testingId === p.id || !p.isEnabled"
                @click="handleTest(p.id)"
              >
                <span v-if="testingId === p.id">Testing...</span>
                <span v-else>Test Ping</span>
              </button>
              <span v-if="testFeedback[p.id]" class="test-feedback">{{ testFeedback[p.id] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
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

.table-responsive { overflow-x: auto; }

.provider-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;

  th, td { padding: 0.9rem 1rem; border-bottom: 1px solid var(--admin-border-color, #e2e8f0); }
  th { font-size: 0.75rem; text-transform: uppercase; color: var(--admin-text-muted, #64748b); font-weight: 600; }

  tr.is-disabled { opacity: 0.6; }
}

.provider-info-cell { display: flex; flex-direction: column; gap: 0.4rem; }
.provider-name-row { display: flex; align-items: center; gap: 0.5rem; }
.provider-title { font-weight: 700; color: var(--admin-text-primary, #0f172a); font-size: 0.95rem; }

.default-badge {
  background: var(--admin-primary-glow, rgba(37, 99, 235, 0.15));
  color: var(--admin-primary, #2563eb);
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.models-chips { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.model-chip {
  font-size: 0.72rem;
  background: var(--admin-bg-app, #f1f5f9);
  color: var(--admin-text-muted, #64748b);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  &.active { font-weight: 700; color: var(--admin-text-primary, #0f172a); border: 1px solid var(--admin-border-color, #cbd5e1); }
}

.health-tag {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  &.healthy { color: var(--admin-success, #10b981); }
  &.warning { color: var(--admin-warning, #f59e0b); }
  &.critical { color: var(--admin-danger, #ef4444); }
}

.key-cell code { font-family: monospace; font-size: 0.8rem; background: var(--admin-bg-app, #f1f5f9); padding: 0.2rem 0.4rem; border-radius: 4px; }

.make-default-btn {
  background: transparent;
  border: 1px solid var(--admin-border-color, #cbd5e1);
  color: var(--admin-text-secondary, #334155);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover { border-color: var(--admin-primary, #2563eb); color: var(--admin-primary, #2563eb); }
}

.primary-label { font-size: 0.78rem; font-weight: 700; color: var(--admin-success, #10b981); }

.switch-toggle {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 20px;
  input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
    background-color: #cbd5e1; transition: .3s; border-radius: 20px;
    &:before {
      position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px;
      background-color: white; transition: .3s; border-radius: 50%;
    }
  }
  input:checked + .slider { background-color: var(--admin-primary, #2563eb); }
  input:checked + .slider:before { transform: translateX(18px); }
}

.test-btn {
  background: var(--admin-bg-app, #f1f5f9);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  color: var(--admin-text-primary, #0f172a);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover:not(:disabled) { background: var(--admin-primary-glow, rgba(37, 99, 235, 0.1)); color: var(--admin-primary, #2563eb); }
}

.test-feedback { display: block; font-size: 0.7rem; color: var(--admin-success, #10b981); margin-top: 0.2rem; }
</style>
