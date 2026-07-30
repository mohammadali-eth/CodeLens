<template>
  <div class="users-view-container">
    <!-- Header Summary Section -->
    <div class="view-header">
      <div class="header-titles">
        <h1 class="page-title">Enterprise User Directory</h1>
        <p class="page-subtitle">Governance, role assignments, and lifecycle management for platform users</p>
      </div>

      <div class="header-actions">
        <button class="btn-secondary" @click="handleRefresh" :disabled="usersStore.isLoading">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Stat Cards Overview -->
    <div class="stat-cards-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">Total Platform Users</span>
          <span class="stat-value">{{ usersStore.userStats.total }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">Active Users</span>
          <span class="stat-value green">{{ usersStore.userStats.active }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon suspended">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">Suspended Accounts</span>
          <span class="stat-value red">{{ usersStore.userStats.suspended }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon pending">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">Pending Verifications</span>
          <span class="stat-value amber">{{ usersStore.userStats.pending }}</span>
        </div>
      </div>
    </div>

    <!-- Filter Toolbar -->
    <UserFilterPanel
      :initial-search="usersStore.filters.search"
      :role-filter="usersStore.filters.role || 'ALL'"
      :status-filter="usersStore.filters.status || 'ALL'"
      :sort-by="usersStore.filters.sortBy || 'createdAt'"
      :page-size="usersStore.filters.pageSize"
      @search="usersStore.setSearch"
      @role-change="usersStore.setRoleFilter"
      @status-change="usersStore.setStatusFilter"
      @sort-change="handleSortChange"
      @page-size-change="usersStore.setPageSize"
    />

    <!-- Skeleton Loader State -->
    <div v-if="usersStore.isLoading" class="skeleton-table">
      <div v-for="i in 5" :key="i" class="skeleton-row"></div>
    </div>

    <!-- Main Data Table -->
    <UserTable
      v-else
      :users="usersStore.users"
      :selected-user-ids="usersStore.selectedUserIds"
      :is-all-selected="usersStore.isAllSelected"
      @toggle-select="usersStore.toggleUserSelection"
      @toggle-select-all="usersStore.toggleSelectAll"
      @view-user="handleViewUser"
      @edit-user="handleEditUser"
      @suspend-user="handleSuspendUser"
      @activate-user="handleActivateUser"
      @delete-user="handleDeleteUser"
    />

    <!-- Pagination Footer -->
    <div class="pagination-footer">
      <span class="pagination-info">
        Showing {{ usersStore.users.length }} of {{ usersStore.totalUsers }} users (Page {{ usersStore.filters.page }} of {{ usersStore.totalPages }})
      </span>

      <div class="pagination-buttons">
        <button
          class="btn-page"
          :disabled="usersStore.filters.page <= 1"
          @click="usersStore.setPage(usersStore.filters.page - 1)"
        >
          Previous
        </button>

        <button
          v-for="p in usersStore.totalPages"
          :key="p"
          class="btn-page-num"
          :class="{ active: p === usersStore.filters.page }"
          @click="usersStore.setPage(p)"
        >
          {{ p }}
        </button>

        <button
          class="btn-page"
          :disabled="usersStore.filters.page >= usersStore.totalPages"
          @click="usersStore.setPage(usersStore.filters.page + 1)"
        >
          Next
        </button>
      </div>
    </div>

    <!-- User Profile Side Drawer -->
    <UserProfileDrawer
      :user="usersStore.selectedUser"
      :audit-logs="usersStore.userAuditLogs"
      :sessions="usersStore.userSessions"
      @close="usersStore.selectedUser = null"
      @reset-password="handleResetPassword"
      @force-logout="handleForceLogout"
      @suspend="handleSuspendUser"
      @activate="handleActivateUser"
    />

    <!-- Role Assignment Modal -->
    <RoleSelector
      :user="editingUser"
      :is-saving="usersStore.isActionLoading"
      @close="editingUser = null"
      @save="handleSaveRole"
    />

    <!-- Floating Bulk Actions Bar -->
    <BulkActionToolbar
      :selected-count="usersStore.selectedUsersCount"
      :is-executing="usersStore.isActionLoading"
      @execute-action="handleBulkAction"
      @clear-selection="usersStore.clearSelection"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUsersStore } from '../../../stores/users.store';
import { ManagedUser, UserRole, BulkUserActionType } from '../../../models';
import UserFilterPanel from '../components/UserFilterPanel.vue';
import UserTable from '../components/UserTable.vue';
import UserProfileDrawer from '../components/UserProfileDrawer.vue';
import RoleSelector from '../components/RoleSelector.vue';
import BulkActionToolbar from '../components/BulkActionToolbar.vue';
import { useUsersWebSocket } from '../composables/useUsersWebSocket';

const usersStore = useUsersStore();
const editingUser = ref<ManagedUser | null>(null);

useUsersWebSocket();

onMounted(() => {
  usersStore.fetchUsers();
});

function handleRefresh() {
  usersStore.fetchUsers();
}

function handleSortChange(sortBy: string) {
  usersStore.filters.sortBy = sortBy as any;
  usersStore.fetchUsers();
}

function handleViewUser(user: ManagedUser) {
  usersStore.fetchUserById(user.id);
}

function handleEditUser(user: ManagedUser) {
  editingUser.value = user;
}

async function handleSaveRole(payload: { role: UserRole; department?: string }) {
  if (editingUser.value) {
    await usersStore.updateUser(editingUser.value.id, payload);
    editingUser.value = null;
  }
}

async function handleSuspendUser(user: ManagedUser) {
  if (confirm(`Are you sure you want to suspend user ${user.email}?`)) {
    await usersStore.updateUserStatus(user.id, 'SUSPENDED');
  }
}

async function handleActivateUser(user: ManagedUser) {
  await usersStore.updateUserStatus(user.id, 'ACTIVE');
}

async function handleDeleteUser(user: ManagedUser) {
  if (confirm(`Are you sure you want to soft-delete user ${user.email}? This can be restored by Super Admin.`)) {
    await usersStore.deleteUser(user.id);
  }
}

async function handleResetPassword(userId: string) {
  if (confirm('Generate temporary password reset token for this user?')) {
    const result = await usersStore.resetPassword(userId);
    if (result.success && result.temporaryPassword) {
      alert(`Temporary password generated: ${result.temporaryPassword}`);
    }
  }
}

async function handleForceLogout(userId: string) {
  if (confirm('Force logout all active sessions for this user?')) {
    const result = await usersStore.forceLogoutUser(userId);
    if (result.success) {
      alert(`Successfully revoked ${result.revokedSessions} active session(s).`);
    }
  }
}

async function handleBulkAction(payload: { action: BulkUserActionType; reason?: string }) {
  await usersStore.executeBulkAction(payload.action, payload.reason);
}
</script>

<style scoped>
.users-view-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.view-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--admin-text-primary);
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--admin-text-muted);
  margin: 0.25rem 0 0 0;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  color: var(--admin-text-primary);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-secondary:hover {
  background-color: var(--admin-bg-app);
  border-color: var(--admin-primary);
  color: var(--admin-primary);
}

.stat-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1rem 1.25rem;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--admin-radius-md);
  flex-shrink: 0;
}

.stat-icon.total { background-color: rgba(37, 99, 235, 0.12); color: #3b82f6; }
.stat-icon.active { background-color: rgba(16, 185, 129, 0.12); color: #10b981; }
.stat-icon.suspended { background-color: rgba(239, 68, 68, 0.12); color: #ef4444; }
.stat-icon.pending { background-color: rgba(245, 158, 11, 0.12); color: #f59e0b; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
  font-weight: 600;
}

.stat-value {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--admin-text-primary);
}

.stat-value.green { color: #10b981; }
.stat-value.red { color: #ef4444; }
.stat-value.amber { color: #f59e0b; }

.skeleton-table {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  background-color: var(--admin-bg-surface);
  border-radius: var(--admin-radius-lg);
}

.skeleton-row {
  height: 48px;
  background: linear-gradient(90deg, var(--admin-bg-surface) 25%, var(--admin-border-color) 50%, var(--admin-bg-surface) 75%);
  background-size: 200% 100%;
  animation: pulse 1.5s infinite;
  border-radius: var(--admin-radius-md);
}

@keyframes pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.pagination-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.5rem 0;
}

.pagination-info {
  font-size: 0.8125rem;
  color: var(--admin-text-muted);
}

.pagination-buttons {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.btn-page {
  padding: 0.4375rem 0.875rem;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  color: var(--admin-text-primary);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-page:not(:disabled):hover {
  border-color: var(--admin-primary);
  color: var(--admin-primary);
}

.btn-page-num {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  color: var(--admin-text-primary);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-page-num.active {
  background-color: var(--admin-primary);
  border-color: var(--admin-primary);
  color: #ffffff;
}
</style>
