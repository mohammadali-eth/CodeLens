<template>
  <div v-if="user" class="admin-profile-card">
    <div class="profile-header">
      <div class="avatar-box">
        <img v-if="user.avatarUrl" :src="user.avatarUrl" :alt="fullName" class="avatar-img" />
        <div v-else class="avatar-fallback">{{ initial }}</div>
      </div>

      <div class="profile-info">
        <h2 class="profile-name">{{ fullName }}</h2>
        <p class="profile-email">{{ user.email }}</p>
        <div class="badge-row">
          <RoleBadge :role="user.role" />
          <span class="status-badge" :class="user.accountStatus.toLowerCase()">
            {{ user.accountStatus }}
          </span>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="profile-details-grid">
      <div class="detail-item">
        <span class="label">Department</span>
        <span class="value">{{ user.department || 'Engineering' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Account Status</span>
        <span class="value status-text">{{ user.isActive ? 'Active' : 'Disabled' }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Last Signed In</span>
        <span class="value">{{ formattedLastLogin }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Member Since</span>
        <span class="value">{{ formattedCreatedAt }}</span>
      </div>
    </div>

    <div class="divider"></div>

    <div class="permissions-section">
      <h4 class="section-title">Granted Permissions</h4>
      <div class="permissions-wrap">
        <PermissionBadge v-for="perm in user.permissions" :key="perm" :permission="perm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AdminUser } from '../../../models';
import RoleBadge from '../../../shared/components/auth/RoleBadge.vue';
import PermissionBadge from '../../../shared/components/auth/PermissionBadge.vue';

interface Props {
  user: AdminUser | null;
}

const props = defineProps<Props>();

const fullName = computed(() => {
  if (!props.user) return 'Admin User';
  return `${props.user.firstName} ${props.user.lastName}`.trim();
});

const initial = computed(() => fullName.value.charAt(0).toUpperCase());

const formattedLastLogin = computed(() => {
  if (!props.user?.lastLoginAt) return 'Active Now';
  return new Date(props.user.lastLoginAt).toLocaleString();
});

const formattedCreatedAt = computed(() => {
  if (!props.user?.createdAt) return 'N/A';
  return new Date(props.user.createdAt).toLocaleDateString();
});
</script>

<style scoped>
.admin-profile-card {
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 1.5rem;
  box-shadow: var(--admin-shadow-sm);
}
.profile-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.avatar-box {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-fallback {
  width: 100%;
  height: 100%;
  background-color: var(--admin-primary);
  color: #ffffff;
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.profile-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}
.profile-email {
  margin: 0;
  font-size: 0.875rem;
  color: var(--admin-text-secondary);
}
.badge-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}
.status-badge {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  text-transform: uppercase;
}
.status-badge.active {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
.status-badge.suspended {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}
.divider {
  height: 1px;
  background-color: var(--admin-border-color);
  margin: 1.25rem 0;
}
.profile-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--admin-text-muted);
  text-transform: uppercase;
}
.value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--admin-text-primary);
}
.section-title {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}
.permissions-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
</style>
