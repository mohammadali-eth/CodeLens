import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useAuthStore } from '../stores/auth.store';
import { permissionGuard } from './guards/permission.guard';
import { roleGuard } from './guards/role.guard';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Vue Router Pipeline Integration
router.beforeEach(async (to, from, next) => {
  // 1. Dynamic Page Title
  if (to.meta.title) {
    document.title = `${to.meta.title} – CodeLens Admin`;
  } else {
    document.title = 'CodeLens Admin Portal';
  }

  const authStore = useAuthStore();

  // 2. Initialize session if uninitialized
  if (authStore.isInitializing) {
    await authStore.initializeAuth();
  }

  // 3. Guest Guard (e.g. /login)
  const requiresGuest = to.matched.some((r) => r.meta.requiresGuest);
  if (requiresGuest && authStore.isAuthenticated) {
    return next({ name: 'dashboard' });
  }

  // 4. Auth Guard
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // 5. Role Guard
  if (requiresAuth && to.meta.roles) {
    let allowed = false;
    roleGuard(to, from, (result?: any) => {
      if (!result) allowed = true;
    });
    if (!allowed) {
      return next({ name: 'unauthorized' });
    }
  }

  // 6. Permission Guard
  if (requiresAuth && to.meta.permission) {
    let allowed = false;
    permissionGuard(to, from, (result?: any) => {
      if (!result) allowed = true;
    });
    if (!allowed) {
      return next({ name: 'unauthorized' });
    }
  }

  return next();
});

export * from './routes';
export * from './guards/auth.guard';
export * from './guards/role.guard';
export * from './guards/permission.guard';
