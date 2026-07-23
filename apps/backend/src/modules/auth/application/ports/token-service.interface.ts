import { User } from '../../domain/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  status: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  family: string;
}

/**
 * ITokenService Port
 * Purpose: Decouples JWT signing logic from token usage in Use Cases.
 * Responsibilities: Defines contracts for issuing and validating access and refresh token pairs.
 * Dependencies: User entity, JwtPayload, TokenPair.
 */
export interface ITokenService {
  generateAccessToken(user: User): Promise<string>;
  generateRefreshToken(user: User, family: string): Promise<string>;
  generateTokenPair(user: User, family?: string): Promise<TokenPair>;
  verifyAccessToken(token: string): Promise<JwtPayload | null>;
  verifyRefreshToken(token: string): Promise<JwtPayload | null>;
}

export const ITokenService = Symbol('ITokenService');
