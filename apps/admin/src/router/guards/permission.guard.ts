import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import { PermissionEngine } from '../../core/auth/permission.engine';
import { AdminPermission } from '../../models';

export function permissionGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const authStore = useAuthStore();
  const requiredPermission = to.meta.permission as AdminPermission | undefined;

  if (requiredPermission) {
    const hasPerm = PermissionEngine.hasPermission(
      requiredPermission,
      authStore.userPermissions,
      authStore.userRole
    );

    if (!hasPerm) {
      next({ name: 'unauthorized' });
      return;
    }
  }

  next();
}
