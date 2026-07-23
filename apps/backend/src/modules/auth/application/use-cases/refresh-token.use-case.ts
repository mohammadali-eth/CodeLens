import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ITokenService } from '../ports/token-service.interface';
import { IRefreshTokenRepository } from '../ports/refresh-token-repository.interface';
import { IUserRepository } from '../ports/user-repository.interface';
import { RefreshToken } from '../../domain/refresh-token.entity';

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * RefreshTokenUseCase
 * Purpose: Handles Refresh Token Rotation and Breach Isolation.
 * Responsibilities: Rotates single-use refresh tokens and revokes entire token family if reuse is detected.
 * Dependencies: ITokenService, IRefreshTokenRepository, IUserRepository.
 */
@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(ITokenService)
    private readonly tokenService: ITokenService,
    @Inject(IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(refreshTokenString: string): Promise<RefreshTokenResponse> {
    const payload = await this.tokenService.verifyRefreshToken(refreshTokenString);
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired refresh token signature');
    }

    const dbToken = await this.refreshTokenRepository.findByToken(refreshTokenString);

    // SECURITY BREACH DETECTION: Revoking token presented again!
    if (dbToken && dbToken.isRevoked) {
      // Token Reuse Attack Detected! Invalidate ALL sessions in this token family
      await this.refreshTokenRepository.revokeFamily(dbToken.family);
      throw new UnauthorizedException('Security Alert: Refresh token reuse detected. Session invalidated.');
    }

    if (!dbToken || !dbToken.isValid()) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const user = await this.userRepository.findById(dbToken.userId);
    if (!user || !user.canAuthenticate()) {
      throw new UnauthorizedException('User account associated with token is inactive');
    }

    // Revoke old refresh token (Single-use token rotation)
    await this.refreshTokenRepository.revokeToken(dbToken.id);

    // Generate new Token Pair with the SAME Token Family
    const newTokenPair = await this.tokenService.generateTokenPair(user, dbToken.family);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const newRefreshTokenEntity = RefreshToken.create(
      crypto.randomUUID(),
      newTokenPair.refreshToken,
      user.id,
      dbToken.family,
      expiresAt,
    );

    await this.refreshTokenRepository.save(newRefreshTokenEntity);

    return {
      accessToken: newTokenPair.accessToken,
      refreshToken: newTokenPair.refreshToken,
    };
  }
}
