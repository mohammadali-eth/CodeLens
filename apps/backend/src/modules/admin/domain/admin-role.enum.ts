/**
 * AdminRole Enum
 * Purpose: Defines platform-wide RBAC roles.
 * Responsibilities: Provides role constants for user permissions and hierarchy enforcement.
 * Dependencies: None.
 */
export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}
