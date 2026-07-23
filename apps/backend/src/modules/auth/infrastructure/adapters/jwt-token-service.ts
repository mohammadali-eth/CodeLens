import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService, JwtPayload, TokenPair } from '../../application/ports/token-service.interface';
import { User } from '../../domain/user.entity';

/**
 * JwtTokenService Adapter
 * Purpose: Infrastructure implementation for signing and verifying JWT tokens.
 * Responsibilities: Issues short-lived access tokens (15m) and long-lived refresh tokens (7d).
 * Dependencies: JwtService from @nestjs/jwt, ITokenService interface.
 */
@Injectable()
export class JwtTokenService implements ITokenService {
  private readonly jwtSecret: string;
  private readonly accessTtl = '15m';
  private readonly refreshTtl = '7d';

  constructor(private readonly jwtService: JwtService) {
    this.jwtSecret = process.env.JWT_SECRET || 'super-secret-key-for-codelens-platform-enterprise-version';
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
      expiresIn: this.accessTtl,
    });
  }

  async generateRefreshToken(user: User, family: string): Promise<string> {
    const payload: JwtPayload & { family: string } = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      family,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
      expiresIn: this.refreshTtl,
    });
  }

  async generateTokenPair(user: User, existingFamily?: string): Promise<TokenPair> {
    const family = existingFamily || crypto.randomUUID();
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user, family);

    return {
      accessToken,
      refreshToken,
      family,
    };
  }

  async verifyAccessToken(token: string): Promise<JwtPayload | null> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.jwtSecret,
      });
    } catch {
      return null;
    }
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload | null> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.jwtSecret,
      });
    } catch {
      return null;
    }
  }
}
