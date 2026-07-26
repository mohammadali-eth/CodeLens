import { AdminRole } from './admin-role.enum';
import { AdminPermission } from './admin-permission.enum';

/**
 * RolePermissionEntity Domain Entity
 * Purpose: Defines mapping between RBAC roles and granular permissions.
 * Responsibilities: Provides permission lookup and validation for roles.
 * Dependencies: AdminRole, AdminPermission.
 */
export class RolePermissionEntity {
  constructor(
    public readonly id: string,
    public readonly role: AdminRole,
    public readonly permission: AdminPermission,
    public readonly createdAt: Date = new Date(),
  ) {}
}
