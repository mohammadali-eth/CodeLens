<template>
  <form class="admin-login-form" @submit.prevent="handleSubmit" novalidate>
    <!-- Server Error Alert -->
    <div v-if="errorMessage" class="alert-banner error" role="alert">
      <svg class="alert-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{{ errorMessage }}</span>
    </div>

    <!-- Email Field -->
    <div class="form-group" :class="{ 'has-error': errors.email }">
      <label for="admin-email" class="form-label">Email Address</label>
      <div class="input-wrapper">
        <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        <input
          id="admin-email"
          v-model="form.email"
          type="email"
          class="form-control"
          placeholder="admin@codelens.ai"
          autocomplete="email"
          required
          @blur="validateEmail"
        />
      </div>
      <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
    </div>

    <!-- Password Field -->
    <div class="form-group" :class="{ 'has-error': errors.password }">
      <label for="admin-password" class="form-label">Password</label>
      <div class="input-wrapper">
        <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <input
          id="admin-password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          class="form-control"
          placeholder="••••••••••••"
          autocomplete="current-password"
          required
          @blur="validatePassword"
        />
        <button
          type="button"
          class="toggle-password-btn"
          @click="showPassword = !showPassword"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
        >
          <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
      <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
    </div>

    <!-- Remember Me Checkbox -->
    <div class="form-options">
      <label class="checkbox-label">
        <input v-model="form.rememberMe" type="checkbox" class="checkbox-input" />
        <span class="checkbox-text">Remember me on this browser</span>
      </label>
    </div>

    <!-- Submit Button -->
    <button type="submit" class="submit-btn" :disabled="isSubmitting">
      <span v-if="isSubmitting" class="spinner-small"></span>
      <span>{{ isSubmitting ? 'Authenticating...' : 'Sign In to Portal' }}</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthForm } from '../composables/useAuthForm';

const showPassword = ref(false);
const { form, errors, errorMessage, isSubmitting, validateEmail, validatePassword, handleSubmit } = useAuthForm();
</script>

<style scoped>
.admin-login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}
.alert-banner {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border-radius: var(--admin-radius-md);
  font-size: 0.8125rem;
  font-weight: 500;
}
.alert-banner.error {
  background-color: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}
.alert-icon {
  flex-shrink: 0;
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
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.field-icon {
  position: absolute;
  left: 0.875rem;
  color: var(--admin-text-muted);
  pointer-events: none;
}
.form-control {
  width: 100%;
  padding: 0.625rem 0.875rem 0.625rem 2.5rem;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  color: var(--admin-text-primary);
  font-size: 0.875rem;
  transition: all 0.15s ease;
}
.form-control:focus {
  outline: none;
  border-color: var(--admin-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}
.form-group.has-error .form-control {
  border-color: #ef4444;
}
.field-error {
  font-size: 0.75rem;
  color: #ef4444;
}
.toggle-password-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--admin-text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toggle-password-btn:hover {
  color: var(--admin-text-primary);
}
.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.checkbox-input {
  accent-color: var(--admin-primary);
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.checkbox-text {
  font-size: 0.8125rem;
  color: var(--admin-text-secondary);
}
.submit-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--admin-primary);
  color: #ffffff;
  border: none;
  border-radius: var(--admin-radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.15s ease;
}
.submit-btn:hover:not(:disabled) {
  background-color: var(--admin-primary-hover);
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
