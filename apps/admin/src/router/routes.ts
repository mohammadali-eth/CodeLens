import { RouteRecordRaw } from 'vue-router';
import { UserRole } from '../models';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../features/auth/views/LoginView.vue'),
    meta: {
      title: 'Admin Sign In',
      requiresGuest: true,
      layout: 'AuthLayout',
    },
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('../features/auth/views/UnauthorizedView.vue'),
    meta: {
      title: 'Access Forbidden',
      requiresAuth: true,
      layout: 'AdminLayout',
    },
  },
  {
    path: '/session-expired',
    name: 'session-expired',
    component: () => import('../features/auth/views/SessionExpiredView.vue'),
    meta: {
      title: 'Session Expired',
      layout: 'AuthLayout',
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../features/dashboard/views/DashboardView.vue'),
    meta: {
      title: 'Dashboard Overview',
      requiresAuth: true,
      layout: 'AdminLayout',
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../features/auth/views/ProfileView.vue'),
    meta: {
      title: 'Admin Profile',
      requiresAuth: true,
      layout: 'AdminLayout',
    },
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../features/users/views/UsersView.vue'),
    meta: {
      title: 'User Management',
      requiresAuth: true,
      permission: 'users.read',
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      layout: 'AdminLayout',
    },
  },
  {
    path: '/reviews',
    name: 'reviews',
    component: () => import('../features/reviews/views/ReviewsView.vue'),
    meta: {
      title: 'Code Reviews',
      requiresAuth: true,
      permission: 'reviews.read',
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR],
      layout: 'AdminLayout',
    },
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('../features/reports/views/ReportsView.vue'),
    meta: {
      title: 'Reports & Export',
      requiresAuth: true,
      permission: 'reports.read',
      layout: 'AdminLayout',
    },
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: () => import('../features/analytics/views/AnalyticsView.vue'),
    meta: {
      title: 'Platform Analytics',
      requiresAuth: true,
      permission: 'analytics.read',
      layout: 'AdminLayout',
    },
  },
  {
    path: '/audit-logs',
    name: 'audit-logs',
    component: () => import('../features/audit-logs/views/AuditLogsView.vue'),
    meta: {
      title: 'System Audit Logs',
      requiresAuth: true,
      permission: 'audit-logs.read',
      roles: [UserRole.SUPER_ADMIN, UserRole.AUDITOR],
      layout: 'AdminLayout',
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../features/settings/views/SettingsView.vue'),
    meta: {
      title: 'System Settings',
      requiresAuth: true,
      permission: 'settings.update',
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      layout: 'AdminLayout',
    },
  },
  {
    path: '/system',
    name: 'system',
    component: () => import('../features/system/views/SystemView.vue'),
    meta: {
      title: 'System Health',
      requiresAuth: true,
      permission: 'system.read',
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      layout: 'AdminLayout',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/dashboard',
  },
];
