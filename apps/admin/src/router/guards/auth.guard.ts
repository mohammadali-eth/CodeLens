import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
}

export function guestGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const authStore = useAuthStore();
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);

  if (requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
}
