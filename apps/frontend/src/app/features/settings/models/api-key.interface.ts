/**
 * ApiKey Interface & Domain Models
 * Purpose: Defines API keys, creation request payloads, and key security states.
 * Responsibilities: Strong typing for user-generated access tokens.
 * Dependencies: None
 */

export interface ApiKey {
  id: string;
  name: string;
  keyHint: string; // e.g. "cl_live_...4f89"
  fullKey?: string; // Only returned on creation
  permissions: string[];
  expiresAt: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}

export interface CreateApiKeyDto {
  name: string;
  expirationDays?: number | null; // null = never expires
  permissions?: string[];
}

export interface CreateApiKeyResponse {
  key: ApiKey;
  secret: string; // Plaintext secret displayed ONCE
}
