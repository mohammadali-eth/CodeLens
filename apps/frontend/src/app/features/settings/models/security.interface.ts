/**
 * Security Domain Models & DTOs
 * Purpose: Password modification contracts, 2FA states, and audit log entries.
 * Responsibilities: Security setting types.
 * Dependencies: None
 */

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorState {
  enabled: boolean;
  method?: 'authenticator' | 'sms' | 'email';
  qrCodeUrl?: string;
  secretKey?: string;
  recoveryCodes?: string[];
}

export interface LoginHistoryEntry {
  id: string;
  timestamp: string;
  ipAddress: string;
  location?: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILED' | 'CHALLENGE_REQUIRED';
}
