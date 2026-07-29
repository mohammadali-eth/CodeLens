import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AdminUser, AuthTokens } from '../models';
import { authService } from '../core/services/auth.service';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AdminUser | null>(null);
  const tokens = ref<AuthTokens | null>(authService.getTokens());
  const isInitializing = ref<boolean>(true);

  const isAuthenticated = computed(() => !!tokens.value?.accessToken);
  const currentUser = computed(() => user.value);
  const userRole = computed(() => user.value?.role);

  function setTokens(newTokens: AuthTokens | null): void {
    tokens.value = newTokens;
    if (newTokens) {
      authService.setTokens(newTokens);
    } else {
      authService.clearTokens();
    }
  }

  function setUser(currentUser: AdminUser | null): void {
    user.value = currentUser;
  }

  function logout(): void {
    user.value = null;
    tokens.value = null;
    authService.clearTokens();
  }

  return {
    user,
    tokens,
    isInitializing,
    isAuthenticated,
    currentUser,
    userRole,
    setTokens,
    setUser,
    logout,
  };
});
