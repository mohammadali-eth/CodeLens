import { AdminPermission, UserRole } from '../../models';

/**
 * Permission Engine Primitives
 * Purpose: Centralized evaluation functions for granular permissions and role hierarchy checks.
 * Responsibilities: Checks single, any, or all required permissions against user's granted permissions list. Supports wildcard `*`.
 * Dependencies: AdminPermission, UserRole types.
 */

export class PermissionEngine {
  public static hasPermission(
    permission: AdminPermission | string,
    grantedPermissions: AdminPermission[] = [],
    userRole?: UserRole
  ): boolean {
    if (userRole === UserRole.SUPER_ADMIN) return true;
    if (grantedPermissions.includes('*' as AdminPermission)) return true;
    return grantedPermissions.includes(permission as AdminPermission);
  }

  public static hasAnyPermission(
    permissions: (AdminPermission | string)[],
    grantedPermissions: AdminPermission[] = [],
    userRole?: UserRole
  ): boolean {
    if (userRole === UserRole.SUPER_ADMIN) return true;
    if (grantedPermissions.includes('*' as AdminPermission)) return true;
    return permissions.some((p) => grantedPermissions.includes(p as AdminPermission));
  }

  public static hasAllPermissions(
    permissions: (AdminPermission | string)[],
    grantedPermissions: AdminPermission[] = [],
    userRole?: UserRole
  ): boolean {
    if (userRole === UserRole.SUPER_ADMIN) return true;
    if (grantedPermissions.includes('*' as AdminPermission)) return true;
    return permissions.every((p) => grantedPermissions.includes(p as AdminPermission));
  }

  public static hasRole(
    requiredRole: UserRole | UserRole[],
    currentRole?: UserRole
  ): boolean {
    if (!currentRole) return false;
    if (currentRole === UserRole.SUPER_ADMIN) return true;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(currentRole);
    }
    return currentRole === requiredRole;
  }
}
