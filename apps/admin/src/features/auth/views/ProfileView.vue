<template>
  <div class="admin-profile-view">
    <div class="page-header">
      <h1 class="page-title">Admin Account Profile</h1>
      <p class="page-subtitle">Manage administrative profile details, credentials, and view permission grants.</p>
    </div>

    <div class="profile-grid">
      <!-- Left Column: Readonly Profile Summary & Badges -->
      <div class="left-col">
        <AdminProfileCard :user="authStore.currentUser" />
      </div>

      <!-- Right Column: Editable Profile Form & Password Management -->
      <div class="right-col">
        <AppCard title="Edit Account Details" subtitle="Update your personal details and department assignment.">
          <form class="profile-form" @submit.prevent="handleProfileSubmit">
            <div v-if="successMsg" class="alert-banner success">
              <span>{{ successMsg }}</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="first-name" class="form-label">First Name</label>
                <input id="first-name" v-model="profileForm.firstName" type="text" class="form-control" />
              </div>
              <div class="form-group">
                <label for="last-name" class="form-label">Last Name</label>
                <input id="last-name" v-model="profileForm.lastName" type="text" class="form-control" />
              </div>
            </div>

            <div class="form-group">
              <label for="department" class="form-label">Department</label>
              <input id="department" v-model="profileForm.department" type="text" class="form-control" placeholder="e.g. Security & Engineering" />
            </div>

            <div class="form-group">
              <label for="avatar-url" class="form-label">Avatar Image URL</label>
              <input id="avatar-url" v-model="profileForm.avatarUrl" type="url" class="form-control" placeholder="https://..." />
            </div>

            <div class="form-actions">
              <button type="submit" class="submit-btn" :disabled="isSaving">
                <span>{{ isSaving ? 'Saving...' : 'Save Profile Changes' }}</span>
              </button>
            </div>
          </form>
        </AppCard>

        <!-- Embedded Change Password Section -->
        <ChangePasswordView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useAuthStore } from '../../../stores/auth.store';
import { useNotificationStore } from '../../../stores/notification.store';
import AppCard from '../../../shared/components/AppCard.vue';
import AdminProfileCard from '../components/AdminProfileCard.vue';
import ChangePasswordView from './ChangePasswordView.vue';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const isSaving = ref(false);
const successMsg = ref<string | null>(null);

const profileForm = reactive({
  firstName: '',
  lastName: '',
  department: '',
  avatarUrl: '',
});

onMounted(() => {
  if (authStore.currentUser) {
    profileForm.firstName = authStore.currentUser.firstName || '';
    profileForm.lastName = authStore.currentUser.lastName || '';
    profileForm.department = authStore.currentUser.department || 'Engineering';
    profileForm.avatarUrl = authStore.currentUser.avatarUrl || '';
  }
});

async function handleProfileSubmit() {
  isSaving.value = true;
  successMsg.value = null;
  try {
    await authStore.updateProfile({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      department: profileForm.department,
      avatarUrl: profileForm.avatarUrl,
    });
    successMsg.value = 'Profile updated successfully!';
    notificationStore.notify({
      type: 'success',
      title: 'Profile Updated',
      message: 'Account details have been saved.',
    });
  } catch (err: any) {
    notificationStore.notify({
      type: 'error',
      title: 'Update Failed',
      message: err.message || 'Could not update profile information.',
    });
  } finally {
    isSaving.value = false;
  }
}
</script>

<style scoped>
.admin-profile-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.page-header {
  margin-bottom: 0.5rem;
}
.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--admin-text-primary);
  margin: 0 0 0.25rem 0;
}
.page-subtitle {
  font-size: 0.875rem;
  color: var(--admin-text-secondary);
  margin: 0;
}
.profile-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 1.5rem;
  align-items: start;
}
@media (max-width: 992px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
.right-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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
.form-actions {
  display: flex;
  justify-content: flex-end;
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
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
