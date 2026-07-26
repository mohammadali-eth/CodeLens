/**
 * AdminPermission Enum & Constants
 * Purpose: Defines granular system permissions for permission-based authorization.
 * Responsibilities: Enforces Fine-Grained Access Control (FGAC) across admin APIs.
 * Dependencies: None.
 */
export enum AdminPermission {
  USERS_READ = 'users.read',
  USERS_UPDATE = 'users.update',
  USERS_DELETE = 'users.delete',
  REVIEWS_READ = 'reviews.read',
  REVIEWS_DELETE = 'reviews.delete',
  REVIEWS_RERUN = 'reviews.rerun',
  ANALYTICS_READ = 'analytics.read',
  AUDIT_READ = 'audit.read',
  SETTINGS_UPDATE = 'settings.update',
}
