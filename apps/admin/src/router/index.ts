import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useAuthStore } from '../stores/auth.store';
import { UserRole } from '../models';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Vue Router Guard Pipeline
router.beforeEach((to, _from, next) => {
  // 1. Dynamic Page Title
  if (to.meta.title) {
    document.title = `${to.meta.title} – CodeLens Admin`;
  } else {
    document.title = 'CodeLens Admin Portal';
  }

  const authStore = useAuthStore();
  const requiresGuest = to.matched.some((r) => r.meta.requiresGuest);
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);

  // 2. Guest Guard (e.g. /login)
  if (requiresGuest && authStore.isAuthenticated) {
    return next({ name: 'dashboard' });
  }

  // 3. Auth Guard
  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // 4. Role Guard
  const requiredRoles = to.meta.roles as UserRole[] | undefined;
  if (requiresAuth && requiredRoles && requiredRoles.length > 0) {
    const currentRole = authStore.userRole;
    if (!currentRole || !requiredRoles.includes(currentRole)) {
      return next({ name: 'dashboard' });
    }
  }

  return next();
});

export * from './routes';
export * from './guards/auth.guard';
export * from './guards/role.guard';
export * from './guards/permission.guard';
