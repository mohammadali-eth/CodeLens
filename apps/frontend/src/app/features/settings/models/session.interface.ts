/**
 * UserSession Interface & Domain Models
 * Purpose: Defines active browser sessions, connected devices, and device metadata.
 * Responsibilities: Strong typing for active device management.
 * Dependencies: None
 */

export interface UserSession {
  id: string;
  userId: string;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  isCurrent: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export interface RevokeSessionResponse {
  success: boolean;
  message: string;
  revokedId?: string;
}
