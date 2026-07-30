/**
 * User Management Domain Interfaces & DTO Models
 * Purpose: Defines contracts for tenant user administration, pagination, filtering, bulk actions, and audit trails.
 * Responsibilities: Ensures strict TypeScript typing across Admin Users Service, Pinia Store, and Vue Components.
 * Dependencies: UserRole, AccountStatus from auth.interface.ts.
 */

import { UserRole, AccountStatus } from './auth.interface';

export type UserStatus = AccountStatus | 'DELETED' | 'VERIFIED' | 'UNVERIFIED';

export interface ManagedUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  department?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
  reviewsCount: number;
  chatsCount: number;
  reportsCount: number;
  activeSessionsCount?: number;
}

export interface UserQueryFilter {
  search?: string;
  role?: UserRole | 'ALL';
  status?: UserStatus | 'ALL';
  sortBy?: 'createdAt' | 'lastLoginAt' | 'name' | 'reviewsCount' | 'email';
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface PaginatedUsersResponse {
  users: ManagedUser[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type BulkUserActionType = 'activate' | 'suspend' | 'delete' | 'export' | 'reset_password';

export interface BulkUserActionPayload {
  action: BulkUserActionType;
  userIds: string[];
  reason?: string;
}

export interface BulkUserActionResult {
  success: boolean;
  affectedCount: number;
  failedIds?: string[];
  message: string;
}

export interface UserAuditLogItem {
  id: string;
  userId: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface UserSessionItem {
  id: string;
  userId: string;
  device: string;
  browser: string;
  ipAddress: string;
  location?: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export interface ModulePermissionsGroup {
  module: string;
  label: string;
  permissions: {
    id: string;
    label: string;
    description: string;
    granted: boolean;
  }[];
}
