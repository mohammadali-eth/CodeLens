/**
 * Models Layer Barrel Export
 * Responsibilities: Domain TypeScript interfaces, DTO definitions, enums, API request/response contracts matching NestJS backend.
 * Dependencies: Independent type definitions used across services, stores, composables, and components.
 */

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  AUDITOR = 'AUDITOR',
  USER = 'USER',
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}
