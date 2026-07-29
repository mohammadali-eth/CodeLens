import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../../stores/auth.store';
import { useNotificationStore } from '../../../stores/notification.store';
import { ApiError } from '../../../core/api/api-error';

/**
 * useAuthForm Composable
 * Purpose: Manages login form reactivity, client-side validations, submission states, and error handling.
 * Responsibilities: Form state tracking, field validation, authStore.login triggering, and post-login routing.
 * Dependencies: useAuthStore, useNotificationStore, useRouter, useRoute.
 */

export function useAuthForm() {
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const notificationStore = useNotificationStore();

  const form = reactive({
    email: '',
    password: '',
    rememberMe: true,
  });

  const errors = reactive<Record<string, string>>({
    email: '',
    password: '',
  });

  const errorMessage = ref<string | null>(null);
  const isSubmitting = ref<boolean>(false);

  function validateEmail(): boolean {
    if (!form.email) {
      errors.email = 'Email address is required.';
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      errors.email = 'Please enter a valid email address.';
      return false;
    }
    errors.email = '';
    return true;
  }

  function validatePassword(): boolean {
    if (!form.password) {
      errors.password = 'Password is required.';
      return false;
    }
    if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
      return false;
    }
    errors.password = '';
    return true;
  }

  function validateForm(): boolean {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    return isEmailValid && isPasswordValid;
  }

  async function handleSubmit(): Promise<boolean> {
    errorMessage.value = null;

    if (!validateForm()) {
      return false;
    }

    isSubmitting.value = true;

    try {
      await authStore.login({
        email: form.email.trim(),
        password: form.password,
        rememberMe: form.rememberMe,
      });

      notificationStore.notify({
        type: 'success',
        title: 'Authentication Successful',
        message: `Welcome back, ${authStore.currentUser?.firstName || 'Admin'}!`,
      });

      const redirectPath = (route.query.redirect as string) || '/dashboard';
      await router.push(redirectPath);
      return true;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        errorMessage.value = err.message;
      } else {
        errorMessage.value = 'Invalid administrator credentials. Please check your email and password.';
      }
      return false;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    form,
    errors,
    errorMessage,
    isSubmitting,
    validateEmail,
    validatePassword,
    handleSubmit,
  };
}
