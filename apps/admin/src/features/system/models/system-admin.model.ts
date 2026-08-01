/**
 * Feature: System Administration & Platform Configuration (Phase A7)
 * Purpose: TypeScript domain models and interfaces for system settings, security policies, AI providers, feature flags, integrations, API keys, audit logs, maintenance mode, storage, email, and about platform metadata.
 * Responsibilities: Provides strict type definitions for all administrative configuration state objects and API DTO payloads.
 * Dependencies: None.
 */

export type SettingsSectionKey =
  | 'general'
  | 'security'
  | 'ai-providers'
  | 'feature-flags'
  | 'integrations'
  | 'api-keys'
  | 'audit-logs'
  | 'maintenance'
  | 'storage'
  | 'email'
  | 'about';

export interface SettingsSectionNavItem {
  key: SettingsSectionKey;
  label: string;
  description: string;
  iconName: string;
  badgeCount?: number;
}

export interface GeneralSettings {
  platformName: string;
  organizationName: string;
  defaultTimeZone: string;
  defaultLanguage: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColorHex: string;
}

export interface SecuritySettings {
  minPasswordLength: number;
  requireSpecialChar: boolean;
  requireNumbers: boolean;
  requireUppercase: boolean;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  jwtExpiration: string;
  allowedOrigins: string[];
}

export type AIProviderKey = 'gemini' | 'openai' | 'anthropic' | 'deepseek';
export type HealthStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export interface AIProviderConfig {
  id: string;
  providerName: string;
  providerKey: AIProviderKey;
  isEnabled: boolean;
  isDefault: boolean;
  status: HealthStatus;
  responseTimeMs: number;
  availableModels: string[];
  activeModel: string;
  apiKeyMasked: string;
  baseUrl?: string;
  maxTokenLimit: number;
}

export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  isEnabled: boolean;
  environment: 'production' | 'staging' | 'development';
  rolloutPercentage: number;
  updatedAt: string;
  updatedBy: string;
}

export type IntegrationProviderKey = 'github' | 'gitlab' | 'bitbucket' | 'slack' | 'email' | 'webhooks';
export type IntegrationCategory = 'vcs' | 'notification' | 'automation';
export type IntegrationStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

export interface IntegrationConfig {
  id: string;
  name: string;
  providerKey: IntegrationProviderKey;
  category: IntegrationCategory;
  status: IntegrationStatus;
  webhookUrl?: string;
  lastSyncAt?: string;
  configJson?: Record<string, any>;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  keyPrefix: string;
  scopes: string[];
  createdAt: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  isRevoked: boolean;
}

export interface CreateApiKeyDto {
  name: string;
  ownerEmail: string;
  scopes: string[];
  expiresInDays?: number;
}

export interface CreatedApiKeyResponse extends ApiKeyItem {
  fullSecretKey: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  administratorEmail: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  detailsJson?: Record<string, any>;
}

export interface MaintenanceConfig {
  isMaintenanceEnabled: boolean;
  message: string;
  allowedIpAddresses: string[];
  allowedRoles: string[];
  scheduledStartAt?: string | null;
  scheduledEndAt?: string | null;
}

export interface StorageTelemetry {
  provider: 'LOCAL_DISK' | 'AWS_S3' | 'GOOGLE_CLOUD_STORAGE';
  totalSpaceBytes: number;
  usedSpaceBytes: number;
  availableSpaceBytes: number;
  usedPercentage: number;
  maxFileUploadMb: number;
  activeBucketsCount: number;
}

export interface EmailTelemetry {
  smtpHost: string;
  smtpPort: number;
  smtpUserMasked: string;
  smtpStatus: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastEmailSentAt: string | null;
  queuePendingCount: number;
  queueProcessedCount: number;
}

export interface PlatformAboutInfo {
  version: string;
  buildHash: string;
  licenseType: string;
  licensedTo: string;
  environment: string;
  nodeVersion: string;
  uptimeSeconds: number;
}
