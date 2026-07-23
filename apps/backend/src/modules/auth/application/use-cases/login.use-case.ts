import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../ports/user-repository.interface';
import { IPasswordHasher } from '../ports/password-hasher.interface';
import { ITokenService } from '../ports/token-service.interface';
import { IRefreshTokenRepository } from '../ports/refresh-token-repository.interface';
import { LoginDto } from '../../infrastructure/controllers/dtos/login.dto';
import { RefreshToken } from '../../domain/refresh-token.entity';
import { UserProfile } from '../../../users/domain/user-profile.entity';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

/**
 * LoginUseCase
 * Purpose: Handles user authentication flow.
 * Responsibilities: Verifies password hash, status eligibility, generates tokens, and saves refresh token session.
 * Dependencies: IUserRepository, IPasswordHasher, ITokenService, IRefreshTokenRepository.
 */
@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(ITokenService)
    private readonly tokenService: ITokenService,
    @Inject(IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(dto.email.toLowerCase().trim());
    if (!user) {
      throw new UnauthorizedException('Invalid email or password credentials');
    }

    if (!user.canAuthenticate()) {
      throw new UnauthorizedException(`Account is ${user.status}. Please contact system support.`);
    }

    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password credentials');
    }

    // Generate Access & Refresh Token Pair with new Token Family
    const tokenPair = await this.tokenService.generateTokenPair(user);

    // Save Refresh Token domain record with 7-day expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshTokenEntity = RefreshToken.create(
      crypto.randomUUID(),
      tokenPair.refreshToken,
      user.id,
      tokenPair.family,
      expiresAt,
    );

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      user: UserProfile.fromUser(user),
    };
  }
}
