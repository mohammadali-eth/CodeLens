import { computed } from 'vue';
import { useAuthStore } from '../../../stores/auth.store';
import { PermissionEngine } from '../../../core/auth/permission.engine';
import { AdminPermission, UserRole } from '../../../models';

/**
 * usePermissions Composable
 * Purpose: Vue 3 Composition API hook providing reactive authorization checks for Vue components and views.
 * Responsibilities: Exposes can(), canAny(), canAll(), isRole(), and helper flags (isSuperAdmin, isAdmin).
 * Dependencies: useAuthStore, PermissionEngine.
 */

export function usePermissions() {
  const authStore = useAuthStore();

  const isSuperAdmin = computed(() => authStore.userRole === UserRole.SUPER_ADMIN);
  const isAdmin = computed(() => authStore.userRole === UserRole.ADMIN || isSuperAdmin.value);

  function can(permission: AdminPermission | string): boolean {
    return PermissionEngine.hasPermission(permission, authStore.userPermissions, authStore.userRole);
  }

  function canAny(permissions: (AdminPermission | string)[]): boolean {
    return PermissionEngine.hasAnyPermission(permissions, authStore.userPermissions, authStore.userRole);
  }

  function canAll(permissions: (AdminPermission | string)[]): boolean {
    return PermissionEngine.hasAllPermissions(permissions, authStore.userPermissions, authStore.userRole);
  }

  function isRole(role: UserRole | UserRole[]): boolean {
    return PermissionEngine.hasRole(role, authStore.userRole);
  }

  return {
    isSuperAdmin,
    isAdmin,
    can,
    canAny,
    canAll,
    isRole,
  };
}
