<script setup lang="ts">
import { ref, computed } from 'vue';
import { FeatureFlag } from '../models/system-admin.model';

const props = defineProps<{
  flags: FeatureFlag[];
}>();

const emit = defineEmits<{
  (e: 'toggle', id: string, isEnabled: boolean): void;
}>();

const searchQuery = ref('');
const selectedEnvironment = ref<string>('all');

const filteredFlags = computed(() => {
  return props.flags.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      f.key.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesEnv = selectedEnvironment.value === 'all' || f.environment === selectedEnvironment.value;
    return matchesSearch && matchesEnv;
  });
});
</script>

<template>
  <div class="panel-card">
    <div class="panel-header">
      <div class="header-left">
        <h3 class="panel-title">Feature Flags & Zero-Downtime Toggles</h3>
        <p class="panel-subtitle">Manage feature flags across production, staging, and development environments.</p>
      </div>

      <div class="filter-controls">
        <input v-model="searchQuery" type="text" placeholder="Search flags..." class="search-input" />
        <select v-model="selectedEnvironment" class="env-select">
          <option value="all">All Environments</option>
          <option value="production">Production</option>
          <option value="staging">Staging</option>
          <option value="development">Development</option>
        </select>
      </div>
    </div>

    <div v-if="filteredFlags.length === 0" class="empty-state">
      <p>No feature flags matched your search filter.</p>
    </div>

    <div v-else class="table-responsive">
      <table class="flag-table">
        <thead>
          <tr>
            <th>Feature Name & Key</th>
            <th>Description</th>
            <th>Environment</th>
            <th>Rollout</th>
            <th>State</th>
            <th>Last Modified</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="flag in filteredFlags" :key="flag.id">
            <td class="flag-name-cell">
              <span class="flag-title">{{ flag.name }}</span>
              <code class="flag-key">{{ flag.key }}</code>
            </td>
            <td class="desc-cell">{{ flag.description }}</td>
            <td>
              <span class="env-badge" :class="flag.environment">
                {{ flag.environment }}
              </span>
            </td>
            <td>
              <span class="rollout-text">{{ flag.rolloutPercentage }}% Users</span>
            </td>
            <td>
              <label class="switch-toggle">
                <input
                  type="checkbox"
                  :checked="flag.isEnabled"
                  @change="emit('toggle', flag.id, ($event.target as HTMLInputElement).checked)"
                />
                <span class="slider"></span>
              </label>
            </td>
            <td class="meta-cell">
              <span class="update-by">{{ flag.updatedBy }}</span>
              <span class="update-at">{{ new Date(flag.updatedAt).toLocaleDateString() }}</span>
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

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.panel-title { font-size: 1.2rem; font-weight: 700; color: var(--admin-text-primary, #0f172a); margin: 0; }
.panel-subtitle { font-size: 0.85rem; color: var(--admin-text-muted, #64748b); margin-top: 0.2rem; }

.filter-controls { display: flex; gap: 0.5rem; }

.search-input, .env-select {
  padding: 0.45rem 0.75rem;
  border-radius: var(--admin-radius-sm, 6px);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  background: var(--admin-bg-surface-hover, #f8fafc);
  color: var(--admin-text-primary, #0f172a);
  font-size: 0.82rem;
}

.table-responsive { overflow-x: auto; }

.flag-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;

  th, td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--admin-border-color, #e2e8f0); }
  th { font-size: 0.75rem; text-transform: uppercase; color: var(--admin-text-muted, #64748b); font-weight: 600; }
}

.flag-name-cell { display: flex; flex-direction: column; gap: 0.2rem; }
.flag-title { font-weight: 700; color: var(--admin-text-primary, #0f172a); }
.flag-key { font-family: monospace; font-size: 0.75rem; color: var(--admin-primary, #2563eb); }

.desc-cell { color: var(--admin-text-secondary, #334155); max-width: 280px; }

.env-badge {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;

  &.production { background: rgba(16, 185, 129, 0.15); color: var(--admin-success, #10b981); }
  &.staging { background: rgba(245, 158, 11, 0.15); color: var(--admin-warning, #f59e0b); }
  &.development { background: rgba(59, 130, 246, 0.15); color: var(--admin-primary, #2563eb); }
}

.rollout-text { font-weight: 600; font-size: 0.8rem; color: var(--admin-text-secondary, #334155); }

.switch-toggle {
  position: relative; display: inline-block; width: 38px; height: 20px;
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

.meta-cell { display: flex; flex-direction: column; font-size: 0.75rem; color: var(--admin-text-muted, #64748b); }
.empty-state { padding: 2rem; text-align: center; color: var(--admin-text-muted, #64748b); }
</style>
