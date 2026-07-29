import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export function permissionGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const requiredPermissions = to.meta.permissions as string[] | undefined;

  if (requiredPermissions && requiredPermissions.length > 0) {
    // Permission validation logic hook
  }

  next();
}
