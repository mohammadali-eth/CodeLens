<script setup lang="ts">
import { onMounted } from 'vue';
import { useSystemAdminStore } from '../../../stores/system-admin.store';
import AuditLogTable from '../../system/components/AuditLogTable.vue';

const store = useSystemAdminStore();

onMounted(() => {
  store.fetchAllSystemState();
});
</script>

<template>
  <div class="audit-logs-view">
    <div class="page-header">
      <h1 class="page-title">Immutable Audit Trail</h1>
      <p class="page-description">Real-time governance trail of administrative system changes, access policies, and security operations.</p>
    </div>

    <div v-if="store.isLoading" class="loading-container">
      <span>Loading security audit logs...</span>
    </div>

    <AuditLogTable v-else :audit-logs="store.auditLogs" />
  </div>
</template>

<style scoped>
.audit-logs-view {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.page-header {
  margin-bottom: 0.5rem;
}
.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin-bottom: 0.25rem;
}
.page-description {
  color: var(--admin-text-secondary);
  font-size: 0.9rem;
}
.loading-container {
  padding: 3rem;
  text-align: center;
  color: var(--admin-text-muted);
}
</style>
