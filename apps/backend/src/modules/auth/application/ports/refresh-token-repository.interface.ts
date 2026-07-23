import { RefreshToken } from '../../domain/refresh-token.entity';

/**
 * IRefreshTokenRepository Port
 * Purpose: Decouples refresh token security mechanisms from database infrastructure.
 * Responsibilities: Provides contracts for token persistence, rotation verification, and breach family revocation.
 * Dependencies: RefreshToken domain entity.
 */
export interface IRefreshTokenRepository {
  findByToken(token: string): Promise<RefreshToken | null>;
  save(refreshToken: RefreshToken): Promise<RefreshToken>;
  revokeToken(id: string): Promise<void>;
  revokeFamily(family: string): Promise<void>;
  revokeAllUserTokens(userId: string): Promise<void>;
}

export const IRefreshTokenRepository = Symbol('IRefreshTokenRepository');
