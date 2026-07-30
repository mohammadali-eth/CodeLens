<template>
  <div class="user-filter-panel">
    <div class="search-box">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search users by name, email, username, or ID..."
        class="search-input"
        @input="onSearchInput"
      />
      <button v-if="searchQuery" class="clear-search-btn" @click="clearSearch" aria-label="Clear search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div class="filter-controls">
      <!-- Role Filter -->
      <div class="filter-group">
        <label class="filter-label">Role:</label>
        <select :value="roleFilter" @change="onRoleChange" class="filter-select">
          <option value="ALL">All Roles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="ADMIN">Admin</option>
          <option value="MODERATOR">Moderator</option>
          <option value="AUDITOR">Auditor</option>
          <option value="USER">User / Developer</option>
        </select>
      </div>

      <!-- Status Filter -->
      <div class="filter-group">
        <label class="filter-label">Status:</label>
        <select :value="statusFilter" @change="onStatusChange" class="filter-select">
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="PENDING">Pending</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <!-- Sorting -->
      <div class="filter-group">
        <label class="filter-label">Sort By:</label>
        <select :value="sortBy" @change="onSortChange" class="filter-select">
          <option value="createdAt">Registration Date</option>
          <option value="lastLoginAt">Last Login</option>
          <option value="name">Name</option>
          <option value="reviewsCount">Reviews Count</option>
        </select>
      </div>

      <!-- Page Size -->
      <div class="filter-group">
        <label class="filter-label">Show:</label>
        <select :value="pageSize" @change="onPageSizeChange" class="filter-select small">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { UserRole, UserStatus } from '../../../models';

const props = defineProps<{
  initialSearch?: string;
  roleFilter: UserRole | 'ALL';
  statusFilter: UserStatus | 'ALL';
  sortBy: string;
  pageSize: number;
}>();

const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'role-change', role: UserRole | 'ALL'): void;
  (e: 'status-change', status: UserStatus | 'ALL'): void;
  (e: 'sort-change', sortBy: string): void;
  (e: 'page-size-change', size: number): void;
}>();

const searchQuery = ref(props.initialSearch || '');
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function onSearchInput() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('search', searchQuery.value.trim());
  }, 300);
}

function clearSearch() {
  searchQuery.value = '';
  emit('search', '');
}

function onRoleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('role-change', target.value as UserRole | 'ALL');
}

function onStatusChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('status-change', target.value as UserStatus | 'ALL');
}

function onSortChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('sort-change', target.value);
}

function onPageSizeChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('page-size-change', parseInt(target.value, 10));
}

watch(
  () => props.initialSearch,
  (val) => {
    if (val !== undefined) searchQuery.value = val;
  }
);
</script>

<style scoped>
.user-filter-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1rem 1.25rem;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 280px;
  max-width: 440px;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--admin-text-muted);
}

.search-input {
  width: 100%;
  padding: 0.5625rem 2.25rem 0.5625rem 2.5rem;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  color: var(--admin-text-primary);
  font-size: 0.84375rem;
  outline: none;
  transition: all 0.15s ease;
}

.search-input:focus {
  border-color: var(--admin-primary);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--admin-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--admin-text-muted);
}

.filter-select {
  padding: 0.5rem 0.75rem;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  color: var(--admin-text-primary);
  font-size: 0.8125rem;
  outline: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-select:focus {
  border-color: var(--admin-primary);
}

.filter-select.small {
  padding: 0.5rem 0.5rem;
}
</style>
