<template>
  <div class="app-table-wrapper">
    <table class="app-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :style="{ width: col.width }">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length" class="state-cell">
            <SkeletonLoader type="table-row" />
          </td>
        </tr>
        <tr v-else-if="!data || data.length === 0">
          <td :colspan="columns.length" class="state-cell">
            <EmptyState />
          </td>
        </tr>
        <tr v-else v-for="(item, rowIndex) in data" :key="rowIndex">
          <td v-for="col in columns" :key="col.key">
            <slot :name="col.key" :item="item" :index="rowIndex">
              {{ item[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import EmptyState from './EmptyState.vue';
import SkeletonLoader from './SkeletonLoader.vue';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
}

interface Props {
  columns: TableColumn[];
  data: Record<string, any>[];
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});
</script>

<style scoped>
.app-table-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  background-color: var(--admin-bg-surface);
}
.app-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.875rem;
}
.app-table th {
  padding: 0.75rem 1rem;
  background-color: var(--admin-bg-app);
  border-bottom: 1px solid var(--admin-border-color);
  font-weight: 700;
  color: var(--admin-text-secondary);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.app-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--admin-border-color);
  color: var(--admin-text-primary);
}
.app-table tbody tr:last-child td {
  border-bottom: none;
}
.app-table tbody tr:hover td {
  background-color: var(--admin-bg-app);
}
.state-cell {
  padding: 2rem !important;
}
</style>
