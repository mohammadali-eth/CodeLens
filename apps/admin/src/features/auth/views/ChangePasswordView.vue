<template>
  <div class="change-password-container">
    <AppCard title="Security Credentials" subtitle="Update your account password to maintain security standards.">
      <form class="password-form" @submit.prevent="handlePasswordSubmit" novalidate>
        <div v-if="successMsg" class="alert-banner success" role="alert">
          <span>{{ successMsg }}</span>
        </div>
        <div v-if="errorMsg" class="alert-banner error" role="alert">
          <span>{{ errorMsg }}</span>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.currentPassword }">
          <label for="current-password" class="form-label">Current Password</label>
          <input
            id="current-password"
            v-model="form.currentPassword"
            type="password"
            class="form-control"
            placeholder="••••••••••••"
            required
          />
          <span v-if="errors.currentPassword" class="field-error">{{ errors.currentPassword }}</span>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.newPassword }">
          <label for="new-password" class="form-label">New Password</label>
          <input
            id="new-password"
            v-model="form.newPassword"
            type="password"
            class="form-control"
            placeholder="••••••••••••"
            required
          />
          <span v-if="errors.newPassword" class="field-error">{{ errors.newPassword }}</span>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.confirmPassword }">
          <label for="confirm-password" class="form-label">Confirm New Password</label>
          <input
            id="confirm-password"
            v-model="form.confirmPassword"
            type="password"
            class="form-control"
            placeholder="••••••••••••"
            required
          />
          <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner-small"></span>
            <span>{{ isSubmitting ? 'Updating...' : 'Update Password' }}</span>
          </button>
        </div>
      </form>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '../../../stores/auth.store';
import { useNotificationStore } from '../../../stores/notification.store';
import AppCard from '../../../shared/components/AppCard.vue';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const errors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const isSubmitting = ref(false);
const successMsg = ref<string | null>(null);
const errorMsg = ref<string | null>(null);

function validate(): boolean {
  let valid = true;
  errors.currentPassword = '';
  errors.newPassword = '';
  errors.confirmPassword = '';

  if (!form.currentPassword) {
    errors.currentPassword = 'Current password is required.';
    valid = false;
  }
  if (!form.newPassword) {
    errors.newPassword = 'New password is required.';
    valid = false;
  } else if (form.newPassword.length < 8) {
    errors.newPassword = 'New password must be at least 8 characters long.';
    valid = false;
  }
  if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = 'New passwords do not match.';
    valid = false;
  }
  return valid;
}

async function handlePasswordSubmit() {
  successMsg.value = null;
  errorMsg.value = null;

  if (!validate()) return;

  isSubmitting.value = true;
  try {
    await authStore.changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });

    successMsg.value = 'Password updated successfully!';
    form.currentPassword = '';
    form.newPassword = '';
    form.confirmPassword = '';

    notificationStore.notify({
      type: 'success',
      title: 'Credentials Updated',
      message: 'Your admin account password has been updated.',
    });
  } catch (err: any) {
    errorMsg.value = err.message || 'Failed to update password. Please verify current password.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.change-password-container {
  max-width: 540px;
}
.password-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.alert-banner {
  padding: 0.75rem 1rem;
  border-radius: var(--admin-radius-md);
  font-size: 0.8125rem;
  font-weight: 500;
}
.alert-banner.success {
  background-color: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
}
.alert-banner.error {
  background-color: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--admin-text-primary);
}
.form-control {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  color: var(--admin-text-primary);
  font-size: 0.875rem;
}
.form-control:focus {
  outline: none;
  border-color: var(--admin-primary);
}
.form-group.has-error .form-control {
  border-color: #ef4444;
}
.field-error {
  font-size: 0.75rem;
  color: #ef4444;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}
.submit-btn {
  padding: 0.625rem 1.25rem;
  background-color: var(--admin-primary);
  color: #ffffff;
  border: none;
  border-radius: var(--admin-radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.spinner-small {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
