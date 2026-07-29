import { describe, it, expect } from 'vitest';
import { PermissionEngine } from '../permission.engine';
import { UserRole, AdminPermission } from '../../models';

describe('PermissionEngine Unit Tests', () => {
  it('should grant access to SUPER_ADMIN regardless of granted permissions array', () => {
    const granted: AdminPermission[] = [];
    const result = PermissionEngine.hasPermission('users.delete', granted, UserRole.SUPER_ADMIN);
    expect(result).toBe(true);
  });

  it('should grant access when wildcard permission "*" is present', () => {
    const granted: AdminPermission[] = ['*' as AdminPermission];
    const result = PermissionEngine.hasPermission('settings.update', granted, UserRole.ADMIN);
    expect(result).toBe(true);
  });

  it('should evaluate explicit granted permission correctly', () => {
    const granted: AdminPermission[] = ['users.read', 'reviews.read'];
    expect(PermissionEngine.hasPermission('users.read', granted, UserRole.ADMIN)).toBe(true);
    expect(PermissionEngine.hasPermission('users.delete', granted, UserRole.ADMIN)).toBe(false);
  });

  it('should correctly evaluate hasAnyPermission', () => {
    const granted: AdminPermission[] = ['reports.read'];
    expect(PermissionEngine.hasAnyPermission(['users.read', 'reports.read'], granted)).toBe(true);
    expect(PermissionEngine.hasAnyPermission(['users.read', 'users.update'], granted)).toBe(false);
  });

  it('should correctly evaluate hasAllPermissions', () => {
    const granted: AdminPermission[] = ['users.read', 'users.update'];
    expect(PermissionEngine.hasAllPermissions(['users.read', 'users.update'], granted)).toBe(true);
    expect(PermissionEngine.hasAllPermissions(['users.read', 'users.delete'], granted)).toBe(false);
  });

  it('should evaluate role hierarchy correctly', () => {
    expect(PermissionEngine.hasRole(UserRole.ADMIN, UserRole.SUPER_ADMIN)).toBe(true);
    expect(PermissionEngine.hasRole(UserRole.ADMIN, UserRole.ADMIN)).toBe(true);
    expect(PermissionEngine.hasRole(UserRole.SUPER_ADMIN, UserRole.ADMIN)).toBe(false);
    expect(PermissionEngine.hasRole([UserRole.ADMIN, UserRole.MODERATOR], UserRole.MODERATOR)).toBe(true);
  });
});
