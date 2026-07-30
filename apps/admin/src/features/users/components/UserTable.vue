<template>
  <div class="user-table-container">
    <table class="user-table" aria-label="User Directory Table">
      <thead>
        <tr>
          <th class="checkbox-col">
            <input
              type="checkbox"
              :checked="isAllSelected"
              @change="$emit('toggle-select-all')"
              aria-label="Select all users"
            />
          </th>
          <th>User</th>
          <th>Role</th>
          <th>Status</th>
          <th>Activity Metrics</th>
          <th>Last Login</th>
          <th>Registered Date</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Empty State -->
        <tr v-if="users.length === 0">
          <td colspan="8" class="empty-cell">
            <div class="empty-state-content">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span class="empty-title">No Users Found</span>
              <span class="empty-desc">No platform user records match your search or filter criteria.</span>
            </div>
          </td>
        </tr>

        <!-- User Rows -->
        <tr
          v-for="user in users"
          :key="user.id"
          :class="{ 'is-selected': isSelected(user.id) }"
          @click="onRowClick(user)"
        >
          <td class="checkbox-col" @click.stop>
            <input
              type="checkbox"
              :checked="isSelected(user.id)"
              @change="$emit('toggle-select', user.id)"
              :aria-label="`Select ${user.email}`"
            />
          </td>
          <td class="user-profile-col">
            <div class="avatar-box">
              <img v-if="user.avatarUrl" :src="user.avatarUrl" :alt="user.username" class="avatar-img" />
              <span v-else class="avatar-initials">{{ getInitials(user) }}</span>
            </div>
            <div class="user-identity">
              <div class="name-group">
                <span class="user-name">{{ getFullName(user) }}</span>
                <span v-if="user.isEmailVerified" class="verified-icon" title="Email Verified">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </span>
              </div>
              <span class="user-email">{{ user.email }}</span>
              <span class="user-meta">@{{ user.username }} • ID: {{ user.id }}</span>
            </div>
          </td>

          <td>
            <span class="role-badge" :class="user.role.toLowerCase()">
              {{ formatRole(user.role) }}
            </span>
          </td>

          <td>
            <StatusBadge :status="user.status" />
          </td>

          <td class="metrics-col">
            <div class="metric-pill" title="Code Reviews Scanned">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              <span>{{ user.reviewsCount || 0 }} reviews</span>
            </div>
            <div class="metric-pill chat" title="AI Chat Sessions">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>{{ user.chatsCount || 0 }} chats</span>
            </div>
          </td>

          <td class="time-col">
            {{ user.lastLoginAt ? formatRelativeTime(user.lastLoginAt) : 'Never' }}
          </td>

          <td class="time-col">
            {{ formatDate(user.createdAt) }}
          </td>

          <td class="actions-col" @click.stop>
            <div class="action-buttons">
              <button class="btn-icon" @click="$emit('view-user', user)" title="View Profile Drawer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>

              <button class="btn-icon" @click="$emit('edit-user', user)" title="Edit Role & Details">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>

              <button
                v-if="user.status === 'ACTIVE'"
                class="btn-icon warning"
                @click="$emit('suspend-user', user)"
                title="Suspend User"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="10" y1="15" x2="10" y2="9"></line>
                  <line x1="14" y1="15" x2="14" y2="9"></line>
                </svg>
              </button>

              <button
                v-else-if="user.status === 'SUSPENDED' || user.status === 'PENDING'"
                class="btn-icon success"
                @click="$emit('activate-user', user)"
                title="Activate User"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>

              <button class="btn-icon danger" @click="$emit('delete-user', user)" title="Delete User">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ManagedUser } from '../../../models';
import StatusBadge from './StatusBadge.vue';

const props = defineProps<{
  users: ManagedUser[];
  selectedUserIds: Set<string>;
  isAllSelected: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle-select', id: string): void;
  (e: 'toggle-select-all'): void;
  (e: 'view-user', user: ManagedUser): void;
  (e: 'edit-user', user: ManagedUser): void;
  (e: 'suspend-user', user: ManagedUser): void;
  (e: 'activate-user', user: ManagedUser): void;
  (e: 'delete-user', user: ManagedUser): void;
}>();

function isSelected(id: string): boolean {
  return props.selectedUserIds.has(id);
}

function onRowClick(user: ManagedUser) {
  emit('view-user', user);
}

function getFullName(user: ManagedUser): string {
  if (user.firstName || user.lastName) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }
  return user.username || user.email.split('@')[0];
}

function getInitials(user: ManagedUser): string {
  const name = getFullName(user);
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function formatRole(role: string): string {
  return String(role).replace('_', ' ');
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
</script>

<style scoped>
.user-table-container {
  width: 100%;
  overflow-x: auto;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8125rem;
}

.user-table th {
  padding: 0.875rem 1rem;
  background-color: var(--admin-bg-app);
  color: var(--admin-text-muted);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--admin-border-color);
}

.user-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--admin-border-color);
  color: var(--admin-text-primary);
  vertical-align: middle;
}

.user-table tr {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.user-table tr:hover {
  background-color: rgba(37, 99, 235, 0.04);
}

.user-table tr.is-selected {
  background-color: rgba(37, 99, 235, 0.08);
}

.user-table tr:last-child td {
  border-bottom: none;
}

.checkbox-col {
  width: 40px;
  text-align: center;
}

.user-profile-col {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 240px;
}

.avatar-box {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--admin-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-identity {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.name-group {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.user-name {
  font-weight: 700;
  color: var(--admin-text-primary);
}

.verified-icon {
  color: #10b981;
  display: inline-flex;
}

.user-email {
  font-size: 0.75rem;
  color: var(--admin-text-secondary);
}

.user-meta {
  font-size: 0.6875rem;
  color: var(--admin-text-muted);
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: var(--admin-radius-md);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.role-badge.super_admin {
  background-color: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.role-badge.admin {
  background-color: rgba(37, 99, 235, 0.15);
  color: #60a5fa;
}

.role-badge.moderator {
  background-color: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.role-badge.auditor {
  background-color: rgba(16, 185, 129, 0.15);
  color: #34d399;
}

.role-badge.user {
  background-color: rgba(100, 116, 139, 0.15);
  color: #cbd5e1;
}

.metrics-col {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--admin-text-secondary);
}

.metric-pill.chat {
  color: #a78bfa;
}

.time-col {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
}

.actions-col {
  width: 120px;
  text-align: right;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.375rem;
}

.btn-icon {
  background: none;
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  color: var(--admin-text-muted);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-icon:hover {
  background-color: var(--admin-bg-app);
  color: var(--admin-primary);
  border-color: var(--admin-primary);
}

.btn-icon.warning:hover {
  color: #f59e0b;
  border-color: #f59e0b;
}

.btn-icon.success:hover {
  color: #10b981;
  border-color: #10b981;
}

.btn-icon.danger:hover {
  color: #ef4444;
  border-color: #ef4444;
}

.empty-cell {
  padding: 3rem 1rem !important;
  text-align: center;
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--admin-text-muted);
}

.empty-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}

.empty-desc {
  font-size: 0.8125rem;
}
</style>
