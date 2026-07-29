/**
 * Configuration Layer
 * Responsibilities: Type-safe environment configuration parsing, API endpoint setup, and feature flag management.
 * Dependencies: ImportMetaEnv from vite-env.d.ts.
 */

export interface FeatureFlags {
  enableAuditLogs: boolean;
  enableWebSockets: boolean;
  enableDarkTheme: boolean;
}

export interface AppConfig {
  apiBaseUrl: string;
  wsUrl: string;
  environment: 'development' | 'testing' | 'production';
  isDevelopment: boolean;
  isProduction: boolean;
  isTesting: boolean;
  featureFlags: FeatureFlags;
}

function parseBooleanEnv(val: string | undefined, defaultValue: boolean = true): boolean {
  if (val === undefined) return defaultValue;
  return val.toLowerCase() === 'true' || val === '1';
}

export const appConfig: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3000/admin/ws',
  environment: (import.meta.env.VITE_APP_ENV as AppConfig['environment']) || 'development',
  isDevelopment: (import.meta.env.VITE_APP_ENV || 'development') === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
  isTesting: import.meta.env.VITE_APP_ENV === 'testing',
  featureFlags: {
    enableAuditLogs: parseBooleanEnv(import.meta.env.VITE_ENABLE_AUDIT_LOGS, true),
    enableWebSockets: parseBooleanEnv(import.meta.env.VITE_ENABLE_WEBSOCKETS, true),
    enableDarkTheme: parseBooleanEnv(import.meta.env.VITE_ENABLE_DARK_THEME, true),
  },
};
