import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../../auth/application/ports/user-repository.interface';
import { IRefreshTokenRepository } from '../../../auth/application/ports/refresh-token-repository.interface';
import { UserProfile } from '../../domain/user-profile.entity';

/**
 * AdminSoftDeleteUserUseCase
 * Purpose: Performs administrative soft deletion.
 * Responsibilities: Sets deletedAt timestamp, updates status to DELETED, and revokes tokens.
 * Dependencies: IUserRepository, IRefreshTokenRepository.
 */
@Injectable()
export class AdminSoftDeleteUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(targetUserId: string): Promise<UserProfile> {
    const user = await this.userRepository.findById(targetUserId);
    if (!user) {
      throw new NotFoundException(`User with ID "${targetUserId}" was not found`);
    }

    const deletedUser = user.softDelete();
    const savedUser = await this.userRepository.save(deletedUser);

    await this.refreshTokenRepository.revokeAllUserTokens(targetUserId);

    return UserProfile.fromUser(savedUser);
  }
}
