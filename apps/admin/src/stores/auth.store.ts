import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  AdminUser,
  AuthTokens,
  UserRole,
  AdminPermission,
  LoginCredentialsDto,
  UpdateProfileDto,
  ChangePasswordDto,
  SessionStatus,
  AccountStatus,
} from '../models';
import { authService } from '../core/services/auth.service';
import { adminAuthService } from '../services/admin-auth.service';
import { userService } from '../services/user.service';

/**
 * AuthStore
 * Purpose: Centralized Pinia setup store for reactive authentication, admin profile, roles, permissions, and session tracking.
 * Responsibilities: Login flow, profile fetching, permission evaluation, credential changes, and session recovery.
 * Dependencies: AuthService, AdminAuthService, UserService, domain interfaces.
 */

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AdminUser | null>(null);
  const tokens = ref<AuthTokens | null>(authService.getTokens());
  const permissions = ref<AdminPermission[]>([]);
  const isInitializing = ref<boolean>(true);
  const rememberMe = ref<boolean>(adminAuthService.getRememberMePreference());
  const sessionStatus = ref<SessionStatus>('ACTIVE');
  const lastActivityAt = ref<number>(Date.now());

  // Computed Getters
  const isAuthenticated = computed(() => !!tokens.value?.accessToken);
  const currentUser = computed(() => user.value);
  const userRole = computed<UserRole | undefined>(() => user.value?.role);
  const userPermissions = computed<AdminPermission[]>(() => permissions.value);
  const accountStatus = computed<AccountStatus | undefined>(() => user.value?.accountStatus);

  // Core Actions
  function setTokens(newTokens: AuthTokens | null): void {
    tokens.value = newTokens;
    if (newTokens) {
      authService.setTokens(newTokens);
    } else {
      authService.clearTokens();
    }
  }

  async function login(credentials: LoginCredentialsDto): Promise<void> {
    rememberMe.value = !!credentials.rememberMe;
    const tokenPair = await adminAuthService.login(credentials);
    setTokens(tokenPair);
    const profile = await fetchCurrentUser();
    if (!profile) {
      throw new Error('Failed to retrieve administrator user profile.');
    }
    sessionStatus.value = 'ACTIVE';
    touchSession();
  }

  async function fetchCurrentUser(): Promise<AdminUser | null> {
    try {
      const profile = await userService.getProfile();
      user.value = profile;

      // Extract permissions array or grant wildcard if SUPER_ADMIN
      if (profile.role === UserRole.SUPER_ADMIN) {
        permissions.value = ['*'];
      } else {
        permissions.value = profile.permissions || [
          'users.read',
          'reviews.read',
          'reports.read',
          'analytics.read',
        ];
      }

      return profile;
    } catch (error) {
      logout();
      return null;
    }
  }

  async function updateProfile(dto: UpdateProfileDto): Promise<AdminUser> {
    const updatedUser = await userService.updateProfile(dto);
    user.value = { ...user.value, ...updatedUser };
    return updatedUser;
  }

  async function changePassword(dto: ChangePasswordDto): Promise<void> {
    await userService.changePassword(dto);
  }

  async function logout(): Promise<void> {
    const currentRefreshToken = tokens.value?.refreshToken;
    user.value = null;
    permissions.value = [];
    setTokens(null);
    sessionStatus.value = 'EXPIRED';
    if (currentRefreshToken) {
      await adminAuthService.logout(currentRefreshToken);
    }
  }

  // Authorization Evaluation Helpers
  function hasPermission(permission: AdminPermission): boolean {
    if (!isAuthenticated.value) return false;
    if (userRole.value === UserRole.SUPER_ADMIN || permissions.value.includes('*')) {
      return true;
    }
    return permissions.value.includes(permission);
  }

  function hasRole(role: UserRole | UserRole[]): boolean {
    if (!isAuthenticated.value || !userRole.value) return false;
    if (Array.isArray(role)) {
      return role.includes(userRole.value);
    }
    return userRole.value === role;
  }

  // Session Activity Helpers
  function touchSession(): void {
    lastActivityAt.value = Date.now();
  }

  function setSessionStatus(status: SessionStatus): void {
    sessionStatus.value = status;
  }

  async function initializeAuth(): Promise<void> {
    isInitializing.value = true;
    if (isAuthenticated.value) {
      await fetchCurrentUser();
    }
    isInitializing.value = false;
  }

  return {
    user,
    tokens,
    permissions,
    isInitializing,
    rememberMe,
    sessionStatus,
    lastActivityAt,
    isAuthenticated,
    currentUser,
    userRole,
    userPermissions,
    accountStatus,
    setTokens,
    login,
    fetchCurrentUser,
    updateProfile,
    changePassword,
    logout,
    hasPermission,
    hasRole,
    touchSession,
    setSessionStatus,
    initializeAuth,
  };
});
