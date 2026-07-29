import { RouteRecordRaw } from 'vue-router';
import { UserRole } from '../models';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../features/auth/views/LoginView.vue'),
    meta: {
      requiresGuest: true,
      layout: 'auth',
      title: 'Admin Sign In',
    },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../features/dashboard/views/DashboardView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'admin',
      title: 'Dashboard Overview',
    },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../features/users/views/UsersView.vue'),
    meta: {
      requiresAuth: true,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      layout: 'admin',
      title: 'User Management',
    },
  },
  {
    path: '/reviews',
    name: 'reviews',
    component: () => import('../features/reviews/views/ReviewsView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'admin',
      title: 'Code Reviews',
    },
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('../features/reports/views/ReportsView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'admin',
      title: 'Reports & Export',
    },
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: () => import('../features/analytics/views/AnalyticsView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'admin',
      title: 'Analytics & Telemetry',
    },
  },
  {
    path: '/audit-logs',
    name: 'audit-logs',
    component: () => import('../features/audit-logs/views/AuditLogsView.vue'),
    meta: {
      requiresAuth: true,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.AUDITOR],
      layout: 'admin',
      title: 'Audit Logs',
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../features/settings/views/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      roles: [UserRole.SUPER_ADMIN],
      layout: 'admin',
      title: 'System Settings',
    },
  },
  {
    path: '/system',
    name: 'system',
    component: () => import('../features/system/views/SystemView.vue'),
    meta: {
      requiresAuth: true,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      layout: 'admin',
      title: 'System Health',
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../features/profile/views/ProfileView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'admin',
      title: 'Admin Profile',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
];
