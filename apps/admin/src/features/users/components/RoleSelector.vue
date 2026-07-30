<template>
  <div v-if="user" class="modal-overlay" @click="close">
    <div class="modal-card" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-title">
          <h2>Update User Role & Permissions</h2>
          <span class="user-subtitle">Modifying RBAC privileges for {{ user.email }}</span>
        </div>
        <button class="close-btn" @click="close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Role Selection Cards -->
        <div class="role-selection-section">
          <label class="section-label">Select Primary Role:</label>
          <div class="roles-grid">
            <div
              v-for="r in availableRoles"
              :key="r.role"
              class="role-card"
              :class="{ selected: selectedRole === r.role }"
              @click="selectedRole = r.role"
            >
              <div class="role-radio">
                <div v-if="selectedRole === r.role" class="radio-inner"></div>
              </div>
              <div class="role-details">
                <span class="role-name">{{ r.label }}</span>
                <span class="role-desc">{{ r.description }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Department Input -->
        <div class="field-group">
          <label class="field-label">Department / Engineering Team:</label>
          <input
            type="text"
            v-model="department"
            placeholder="e.g. Security & DevOps, Frontend Engineering"
            class="form-input"
          />
        </div>

        <!-- Permission Matrix Preview -->
        <div class="permission-section">
          <label class="section-label">Effective Permission Matrix Preview:</label>
          <PermissionMatrix :groups="permissionGroups" />
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button class="btn-cancel" @click="close">Cancel</button>
        <button class="btn-save" :disabled="isSaving" @click="save">
          <span v-if="isSaving">Saving Changes...</span>
          <span v-else>Apply Role Changes</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ManagedUser, UserRole, ModulePermissionsGroup } from '../../../models';
import PermissionMatrix from './PermissionMatrix.vue';

const props = defineProps<{
  user: ManagedUser | null;
  isSaving?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', payload: { role: UserRole; department?: string }): void;
}>();

const selectedRole = ref<UserRole>(UserRole.USER);
const department = ref<string>('');

watch(
  () => props.user,
  (val) => {
    if (val) {
      selectedRole.value = val.role;
      department.value = val.department || '';
    }
  },
  { immediate: true }
);

const availableRoles = [
  {
    role: UserRole.SUPER_ADMIN,
    label: 'Super Administrator',
    description: 'Unrestricted full platform governance, security key management, and tenant administration.',
  },
  {
    role: UserRole.ADMIN,
    label: 'Platform Administrator',
    description: 'Full user management, review governance, report export, and queue status control.',
  },
  {
    role: UserRole.MODERATOR,
    label: 'Code Review Board',
    description: 'Code review oversight, quality score overrides, and developer comment moderation.',
  },
  {
    role: UserRole.AUDITOR,
    label: 'Compliance Auditor',
    description: 'Read-only security audit log inspector and platform compliance report viewer.',
  },
  {
    role: UserRole.USER,
    label: 'Developer User',
    description: 'Standard software engineer with scan submission, AI chat, and personal dashboard access.',
  },
];

const permissionGroups = computed<ModulePermissionsGroup[]>(() => {
  const isSuper = selectedRole.value === UserRole.SUPER_ADMIN;
  const isAdmin = isSuper || selectedRole.value === UserRole.ADMIN;
  const isMod = isAdmin || selectedRole.value === UserRole.MODERATOR;
  const isAuditor = isSuper || selectedRole.value === UserRole.AUDITOR;

  return [
    {
      module: 'users',
      label: 'User Directory & Role Governance',
      permissions: [
        { id: 'users.read', label: 'View User Directory', description: 'Browse and inspect platform user profiles.', granted: true },
        { id: 'users.edit', label: 'Edit Roles & Status', description: 'Assign roles and update account statuses.', granted: isAdmin },
        { id: 'users.delete', label: 'Soft-Delete Users', description: 'Deactivate and soft-delete user accounts.', granted: isSuper },
      ],
    },
    {
      module: 'reviews',
      label: 'Code Review Inspection & AI Analysis',
      permissions: [
        { id: 'reviews.submit', label: 'Submit Code Reviews', description: 'Trigger AI static analysis on PRs.', granted: true },
        { id: 'reviews.override', label: 'Quality Score Override', description: 'Manually adjust automated AI scores.', granted: isMod },
        { id: 'reviews.delete', label: 'Purge Scan History', description: 'Permanently remove analysis records.', granted: isAdmin },
      ],
    },
    {
      module: 'audit',
      label: 'Audit Trail & Platform Monitoring',
      permissions: [
        { id: 'audit.read', label: 'View Security Audit Logs', description: 'Inspect authentication and RBAC events.', granted: isAuditor || isAdmin },
        { id: 'system.manage', label: 'Manage Queue Workers', description: 'Pause or re-queue BullMQ background jobs.', granted: isAdmin },
      ],
    },
  ];
});

function close() {
  emit('close');
}

function save() {
  emit('save', {
    role: selectedRole.value,
    department: department.value.trim(),
  });
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-card {
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-app);
}

.header-title h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--admin-text-primary);
  margin: 0;
}

.user-subtitle {
  font-size: 0.8125rem;
  color: var(--admin-text-muted);
}

.close-btn {
  background: none;
  border: none;
  color: var(--admin-text-muted);
  cursor: pointer;
  padding: 0.25rem;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--admin-text-muted);
  margin-bottom: 0.625rem;
  display: block;
}

.roles-grid {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.role-card {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  cursor: pointer;
  transition: all 0.15s ease;
}

.role-card.selected {
  border-color: var(--admin-primary);
  background-color: rgba(37, 99, 235, 0.06);
}

.role-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--admin-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.role-card.selected .role-radio {
  border-color: var(--admin-primary);
}

.radio-inner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--admin-primary);
}

.role-details {
  display: flex;
  flex-direction: column;
}

.role-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}

.role-desc {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
  margin-top: 0.125rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--admin-text-muted);
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  color: var(--admin-text-primary);
  font-size: 0.84375rem;
  outline: none;
}

.form-input:focus {
  border-color: var(--admin-primary);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-app);
}

.btn-cancel {
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  color: var(--admin-text-primary);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-save {
  padding: 0.5rem 1.25rem;
  background-color: var(--admin-primary);
  border: none;
  border-radius: var(--admin-radius-md);
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
