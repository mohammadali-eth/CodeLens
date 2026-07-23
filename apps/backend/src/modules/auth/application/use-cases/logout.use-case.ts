import { Inject, Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from '../ports/refresh-token-repository.interface';

/**
 * LogoutUseCase
 * Purpose: Session termination workflow.
 * Responsibilities: Revokes active refresh token sessions.
 * Dependencies: IRefreshTokenRepository.
 */
@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(
    refreshTokenString?: string,
    userId?: string,
  ): Promise<{ success: boolean }> {
    if (refreshTokenString) {
      const dbToken =
        await this.refreshTokenRepository.findByToken(refreshTokenString);
      if (dbToken) {
        await this.refreshTokenRepository.revokeToken(dbToken.id);
      }
    } else if (userId) {
      await this.refreshTokenRepository.revokeAllUserTokens(userId);
    }
    return { success: true };
  }
}
