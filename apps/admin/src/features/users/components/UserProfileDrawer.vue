<template>
  <div v-if="user" class="drawer-overlay" @click="close">
    <div class="drawer-panel" @click.stop>
      <!-- Header -->
      <div class="drawer-header">
        <div class="header-profile">
          <div class="avatar-box">
            <img v-if="user.avatarUrl" :src="user.avatarUrl" :alt="user.username" />
            <span v-else>{{ initials }}</span>
          </div>
          <div class="profile-titles">
            <h2 class="user-name">{{ fullName }}</h2>
            <span class="user-email">{{ user.email }}</span>
            <div class="badge-row">
              <span class="role-pill">{{ user.role }}</span>
              <StatusBadge :status="user.status" />
            </div>
          </div>
        </div>

        <button class="close-btn" @click="close" aria-label="Close drawer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Navigation Tabs -->
      <div class="drawer-tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'info' }"
          @click="activeTab = 'info'"
        >
          Account Overview
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'sessions' }"
          @click="activeTab = 'sessions'"
        >
          Active Sessions ({{ sessions.length }})
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'audit' }"
          @click="activeTab = 'audit'"
        >
          Audit History ({{ auditLogs.length }})
        </button>
      </div>

      <!-- Drawer Body Content -->
      <div class="drawer-body">
        <!-- Account Overview Tab -->
        <div v-if="activeTab === 'info'" class="tab-pane">
          <div class="info-grid">
            <div class="info-card">
              <span class="info-label">User ID</span>
              <span class="info-value font-mono">{{ user.id }}</span>
            </div>
            <div class="info-card">
              <span class="info-label">Username</span>
              <span class="info-value">@{{ user.username }}</span>
            </div>
            <div class="info-card">
              <span class="info-label">Department / Team</span>
              <span class="info-value">{{ user.department || 'Engineering' }}</span>
            </div>
            <div class="info-card">
              <span class="info-label">Email Verification</span>
              <span class="info-value" :class="user.isEmailVerified ? 'text-green' : 'text-amber'">
                {{ user.isEmailVerified ? 'Verified' : 'Pending Verification' }}
              </span>
            </div>
            <div class="info-card">
              <span class="info-label">Registration Date</span>
              <span class="info-value">{{ formatDate(user.createdAt) }}</span>
            </div>
            <div class="info-card">
              <span class="info-label">Last Login</span>
              <span class="info-value">{{ formatDate(user.lastLoginAt) }}</span>
            </div>
          </div>

          <!-- Activity Summary Counters -->
          <div class="activity-summary-box">
            <h3 class="box-title">Platform Activity</h3>
            <div class="summary-metrics-grid">
              <div class="metric-box">
                <span class="metric-num">{{ user.reviewsCount || 0 }}</span>
                <span class="metric-lbl">Code Reviews Scanned</span>
              </div>
              <div class="metric-box">
                <span class="metric-num purple">{{ user.chatsCount || 0 }}</span>
                <span class="metric-lbl">AI Assistant Chats</span>
              </div>
              <div class="metric-box">
                <span class="metric-num blue">{{ user.reportsCount || 0 }}</span>
                <span class="metric-lbl">Reports Generated</span>
              </div>
            </div>
          </div>

          <!-- Quick Security Actions -->
          <div class="actions-section">
            <h3 class="box-title">Administrative Actions</h3>
            <div class="actions-buttons-grid">
              <button class="action-btn" @click="$emit('reset-password', user.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Reset Password</span>
              </button>

              <button class="action-btn warning" @click="$emit('force-logout', user.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Force Logout All Sessions</span>
              </button>

              <button
                v-if="user.status === 'ACTIVE'"
                class="action-btn danger"
                @click="$emit('suspend', user)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="10" y1="15" x2="10" y2="9"></line>
                  <line x1="14" y1="15" x2="14" y2="9"></line>
                </svg>
                <span>Suspend User Account</span>
              </button>

              <button
                v-else
                class="action-btn success"
                @click="$emit('activate', user)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Re-activate User Account</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Sessions Tab -->
        <div v-else-if="activeTab === 'sessions'" class="tab-pane">
          <SessionTable :sessions="sessions" @revoke-session="$emit('force-logout', user.id)" />
        </div>

        <!-- Audit Tab -->
        <div v-else-if="activeTab === 'audit'" class="tab-pane">
          <AuditPreview :logs="auditLogs" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ManagedUser, UserAuditLogItem, UserSessionItem } from '../../../models';
import StatusBadge from './StatusBadge.vue';
import SessionTable from './SessionTable.vue';
import AuditPreview from './AuditPreview.vue';

const props = defineProps<{
  user: ManagedUser | null;
  auditLogs: UserAuditLogItem[];
  sessions: UserSessionItem[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'reset-password', userId: string): void;
  (e: 'force-logout', userId: string): void;
  (e: 'suspend', user: ManagedUser): void;
  (e: 'activate', user: ManagedUser): void;
}>();

const activeTab = ref<'info' | 'sessions' | 'audit'>('info');

function close() {
  emit('close');
}

const fullName = computed(() => {
  if (!props.user) return '';
  if (props.user.firstName || props.user.lastName) {
    return `${props.user.firstName || ''} ${props.user.lastName || ''}`.trim();
  }
  return props.user.username || props.user.email;
});

const initials = computed(() => {
  const name = fullName.value;
  const parts = name.split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
});

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  width: 100%;
  max-width: 580px;
  height: 100vh;
  background-color: var(--admin-bg-surface);
  border-left: 1px solid var(--admin-border-color);
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 25px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.25s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-app);
}

.header-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-box {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: var(--admin-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.125rem;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-titles {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.user-name {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--admin-text-primary);
  margin: 0;
}

.user-email {
  font-size: 0.8125rem;
  color: var(--admin-text-muted);
}

.badge-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.375rem;
}

.role-pill {
  padding: 0.125rem 0.5rem;
  background-color: rgba(37, 99, 235, 0.15);
  color: #60a5fa;
  font-size: 0.6875rem;
  font-weight: 700;
  border-radius: var(--admin-radius-md);
  text-transform: uppercase;
}

.close-btn {
  background: none;
  border: none;
  color: var(--admin-text-muted);
  cursor: pointer;
  padding: 0.375rem;
  border-radius: var(--admin-radius-md);
  transition: all 0.15s ease;
}

.close-btn:hover {
  background-color: var(--admin-bg-surface);
  color: var(--admin-text-primary);
}

.drawer-tabs {
  display: flex;
  border-bottom: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-app);
  padding: 0 1rem;
}

.tab-btn {
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--admin-text-muted);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tab-btn.active {
  border-bottom-color: var(--admin-primary);
  color: var(--admin-primary);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 0.75rem 1rem;
}

.info-label {
  font-size: 0.71875rem;
  color: var(--admin-text-muted);
  font-weight: 600;
  text-transform: uppercase;
}

.info-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}

.font-mono { font-family: monospace; }
.text-green { color: #10b981; }
.text-amber { color: #f59e0b; }

.box-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0 0 0.875rem 0;
}

.summary-metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.875rem;
}

.metric-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 1rem 0.5rem;
  text-align: center;
}

.metric-num {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--admin-text-primary);
}

.metric-num.purple { color: #a78bfa; }
.metric-num.blue { color: #60a5fa; }

.metric-lbl {
  font-size: 0.6875rem;
  color: var(--admin-text-muted);
  margin-top: 0.25rem;
}

.actions-buttons-grid {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.6875rem 1rem;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  color: var(--admin-text-primary);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover {
  border-color: var(--admin-primary);
  color: var(--admin-primary);
}

.action-btn.warning:hover {
  border-color: #f59e0b;
  color: #f59e0b;
}

.action-btn.danger:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.action-btn.success:hover {
  border-color: #10b981;
  color: #10b981;
}
</style>
