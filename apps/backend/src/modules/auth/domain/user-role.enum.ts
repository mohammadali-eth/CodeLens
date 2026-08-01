/**
 * UserRole Enum
 * Purpose: Defines system authorization roles for RBAC enforcement.
 * Responsibilities: Provides role constants for security guards and decorators.
 * Dependencies: None.
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}
