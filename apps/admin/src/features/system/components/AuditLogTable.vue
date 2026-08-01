<script setup lang="ts">
import { ref, computed } from 'vue';
import { AuditLogEntry } from '../models/system-admin.model';

const props = defineProps<{
  auditLogs: AuditLogEntry[];
}>();

const searchQuery = ref('');
const statusFilter = ref<string>('all');

const filteredLogs = computed(() => {
  return props.auditLogs.filter((log) => {
    const matchesSearch =
      log.administratorEmail.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.ipAddress.includes(searchQuery.value);
    const matchesStatus = statusFilter.value === 'all' || log.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});
</script>

<template>
  <div class="panel-card">
    <div class="panel-header">
      <div class="header-left">
        <h3 class="panel-title">System Governance Audit Logs</h3>
        <p class="panel-subtitle">Immutable log of security policies, role changes, feature flag toggles, and system actions.</p>
      </div>

      <div class="filter-controls">
        <input v-model="searchQuery" type="text" placeholder="Filter audit events..." class="search-input" />
        <select v-model="statusFilter" class="status-select">
          <option value="all">All Statuses</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILURE">Failure</option>
          <option value="WARNING">Warning</option>
        </select>
      </div>
    </div>

    <div v-if="filteredLogs.length === 0" class="empty-state">
      <p>No audit events match your search criteria.</p>
    </div>

    <div v-else class="table-responsive">
      <table class="audit-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Administrator</th>
            <th>Action</th>
            <th>Resource</th>
            <th>IP Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in filteredLogs" :key="log.id">
            <td class="time-cell">{{ new Date(log.timestamp).toLocaleString() }}</td>
            <td class="admin-cell">{{ log.administratorEmail }}</td>
            <td>
              <span class="action-tag">{{ log.action }}</span>
            </td>
            <td class="resource-cell">{{ log.resource }}</td>
            <td class="ip-cell"><code>{{ log.ipAddress }}</code></td>
            <td>
              <span class="status-badge" :class="log.status.toLowerCase()">
                ● {{ log.status }}
              </span>
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
.search-input, .status-select {
  padding: 0.45rem 0.75rem;
  border-radius: var(--admin-radius-sm, 6px);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  background: var(--admin-bg-surface-hover, #f8fafc);
  color: var(--admin-text-primary, #0f172a);
  font-size: 0.82rem;
}

.table-responsive { overflow-x: auto; }

.audit-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;

  th, td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--admin-border-color, #e2e8f0); }
  th { font-size: 0.75rem; text-transform: uppercase; color: var(--admin-text-muted, #64748b); font-weight: 600; }
}

.time-cell { font-size: 0.78rem; color: var(--admin-text-muted, #64748b); }
.admin-cell { font-weight: 600; color: var(--admin-text-primary, #0f172a); }
.action-tag { font-family: monospace; font-size: 0.75rem; font-weight: 700; color: var(--admin-primary, #2563eb); background: var(--admin-primary-glow, rgba(37, 99, 235, 0.1)); padding: 0.15rem 0.4rem; border-radius: 4px; }
.ip-cell code { font-family: monospace; font-size: 0.78rem; background: var(--admin-bg-app, #f1f5f9); padding: 0.15rem 0.4rem; border-radius: 4px; }

.status-badge {
  font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px;
  &.success { color: var(--admin-success, #10b981); background: rgba(16, 185, 129, 0.12); }
  &.failure { color: var(--admin-danger, #ef4444); background: rgba(239, 68, 68, 0.12); }
  &.warning { color: var(--admin-warning, #f59e0b); background: rgba(245, 158, 11, 0.12); }
}

.empty-state { padding: 2rem; text-align: center; color: var(--admin-text-muted, #64748b); }
</style>
