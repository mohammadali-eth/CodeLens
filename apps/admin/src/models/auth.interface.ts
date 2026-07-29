/**
 * Auth Domain Interfaces & DTO Models
 * Purpose: Defines strong typing contracts for authentication, permissions, sessions, and user credentials.
 * Responsibilities: Request/response payloads matching NestJS backend auth endpoints.
 * Dependencies: Independent types used by services, stores, guards, and components.
 */

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  AUDITOR = 'AUDITOR',
  USER = 'USER',
}

export type AdminPermission =
  | 'users.read'
  | 'users.create'
  | 'users.update'
  | 'users.delete'
  | 'reviews.read'
  | 'reviews.delete'
  | 'reports.read'
  | 'reports.export'
  | 'analytics.read'
  | 'audit-logs.read'
  | 'settings.update'
  | 'system.read'
  | 'profile.update'
  | 'profile.change-password'
  | '*';

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'INACTIVE';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: AdminPermission[];
  accountStatus: AccountStatus;
  avatarUrl?: string;
  isActive: boolean;
  department?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentialsDto {
  email: string;
  password?: string;
  passwordHash?: string;
  rememberMe?: boolean;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  department?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export type SessionStatus = 'ACTIVE' | 'WARNING' | 'EXPIRED';

export interface SessionState {
  isAuthenticated: boolean;
  sessionStatus: SessionStatus;
  lastActivityAt: number;
  expiresInMs: number;
  rememberMe: boolean;
  isAutoLogin: boolean;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  permission?: AdminPermission;
  roles?: UserRole[];
  badge?: string;
  children?: NavigationMenuItem[];
}
