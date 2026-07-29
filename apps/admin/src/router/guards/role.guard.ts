import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import { UserRole } from '../../models';

export function roleGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const authStore = useAuthStore();
  const requiredRoles = to.meta.roles as UserRole[] | undefined;

  if (requiredRoles && requiredRoles.length > 0) {
    const currentRole = authStore.userRole;
    if (!currentRole || !requiredRoles.includes(currentRole)) {
      next({ name: 'dashboard' });
      return;
    }
  }

  next();
}
