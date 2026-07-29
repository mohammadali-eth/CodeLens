import { NavigationMenuItem, AdminPermission, UserRole } from '../../models';
import { PermissionEngine } from './permission.engine';

/**
 * Dynamic Navigation Builder
 * Purpose: Dynamically filters administrative navigation items based on active admin permissions and roles.
 * Responsibilities: Defines raw navigation schema and exports generateDynamicNavigation builder.
 * Dependencies: NavigationMenuItem, AdminPermission, UserRole, PermissionEngine.
 */

export const ADMIN_NAVIGATION_SCHEMA: NavigationMenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'layout-dashboard',
  },
  {
    id: 'users',
    label: 'User Management',
    path: '/users',
    icon: 'users',
    permission: 'users.read',
  },
  {
    id: 'reviews',
    label: 'Code Reviews',
    path: '/reviews',
    icon: 'code-2',
    permission: 'reviews.read',
  },
  {
    id: 'reports',
    label: 'Reports & Export',
    path: '/reports',
    icon: 'file-bar-chart',
    permission: 'reports.read',
  },
  {
    id: 'analytics',
    label: 'Platform Analytics',
    path: '/analytics',
    icon: 'trending-up',
    permission: 'analytics.read',
  },
  {
    id: 'audit-logs',
    label: 'Audit Logs',
    path: '/audit-logs',
    icon: 'shield-check',
    permission: 'audit-logs.read',
  },
  {
    id: 'settings',
    label: 'System Settings',
    path: '/settings',
    icon: 'settings',
    permission: 'settings.update',
  },
  {
    id: 'system',
    label: 'System Health',
    path: '/system',
    icon: 'activity',
    permission: 'system.read',
  },
];

export function generateDynamicNavigation(
  grantedPermissions: AdminPermission[] = [],
  userRole?: UserRole
): NavigationMenuItem[] {
  return ADMIN_NAVIGATION_SCHEMA.filter((item) => {
    // 1. Check role constraint if present
    if (item.roles && !PermissionEngine.hasRole(item.roles, userRole)) {
      return false;
    }

    // 2. Check permission constraint if present
    if (item.permission && !PermissionEngine.hasPermission(item.permission, grantedPermissions, userRole)) {
      return false;
    }

    return true;
  });
}
