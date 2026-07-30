<template>
  <div class="session-table-container">
    <table class="session-table" aria-label="Active User Sessions">
      <thead>
        <tr>
          <th>Device & Browser</th>
          <th>IP Address</th>
          <th>Location</th>
          <th>Last Active</th>
          <th class="actions-col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="sessions.length === 0">
          <td colspan="5" class="empty-cell">No active session records found for this user.</td>
        </tr>
        <tr v-for="session in sessions" :key="session.id">
          <td>
            <div class="device-box">
              <span class="device-name">{{ session.device }}</span>
              <span class="browser-info">{{ session.browser }}</span>
              <span v-if="session.isCurrent" class="current-pill">Current Session</span>
            </div>
          </td>
          <td class="ip-col">{{ session.ipAddress }}</td>
          <td>{{ session.location || 'Unknown Location' }}</td>
          <td class="time-col">{{ formatRelativeTime(session.lastActiveAt) }}</td>
          <td class="actions-col">
            <button
              class="btn-revoke"
              @click="$emit('revoke-session', session.id)"
              title="Revoke session"
              :disabled="session.isCurrent"
            >
              Revoke
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { UserSessionItem } from '../../../models';

defineProps<{
  sessions: UserSessionItem[];
}>();

defineEmits<{
  (e: 'revoke-session', sessionId: string): void;
}>();

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
</script>

<style scoped>
.session-table-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  background-color: var(--admin-bg-app);
}

.session-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.session-table th {
  padding: 0.75rem 0.875rem;
  background-color: var(--admin-bg-surface);
  color: var(--admin-text-muted);
  font-weight: 700;
  font-size: 0.71875rem;
  text-transform: uppercase;
  border-bottom: 1px solid var(--admin-border-color);
}

.session-table td {
  padding: 0.75rem 0.875rem;
  border-bottom: 1px solid var(--admin-border-color);
  color: var(--admin-text-primary);
  vertical-align: middle;
}

.device-box {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.device-name {
  font-weight: 700;
}

.browser-info {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
}

.current-pill {
  display: inline-block;
  padding: 0.125rem 0.375rem;
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
  font-size: 0.6875rem;
  font-weight: 700;
  border-radius: var(--admin-radius-full);
  margin-top: 0.25rem;
  width: fit-content;
}

.ip-col {
  font-family: monospace;
  color: var(--admin-text-secondary);
}

.time-col {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
}

.actions-col {
  text-align: right;
}

.btn-revoke {
  padding: 0.25rem 0.625rem;
  background-color: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--admin-radius-md);
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-revoke:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: var(--admin-border-color);
  color: var(--admin-text-muted);
}

.btn-revoke:not(:disabled):hover {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.empty-cell {
  text-align: center;
  padding: 1.5rem !important;
  color: var(--admin-text-muted);
}
</style>
