import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../../auth/application/ports/user-repository.interface';
import { IRefreshTokenRepository } from '../../../auth/application/ports/refresh-token-repository.interface';
import { UpdateUserStatusDto } from '../../infrastructure/controllers/dtos/update-user-status.dto';
import { UserProfile } from '../../domain/user-profile.entity';
import { UserStatus } from '../../../auth/domain/user-status.enum';

/**
 * AdminUpdateUserStatusUseCase
 * Purpose: Allows administrators to change account lifecycle status.
 * Responsibilities: Updates user status and revokes sessions if account is suspended or deleted.
 * Dependencies: IUserRepository, IRefreshTokenRepository.
 */
@Injectable()
export class AdminUpdateUserStatusUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(targetUserId: string, dto: UpdateUserStatusDto): Promise<UserProfile> {
    const user = await this.userRepository.findById(targetUserId);
    if (!user) {
      throw new NotFoundException(`User with ID "${targetUserId}" was not found`);
    }

    const updatedUser = user.updateStatus(dto.status);
    const savedUser = await this.userRepository.save(updatedUser);

    if (dto.status === UserStatus.SUSPENDED || dto.status === UserStatus.DELETED || dto.status === UserStatus.INACTIVE) {
      await this.refreshTokenRepository.revokeAllUserTokens(targetUserId);
    }

    return UserProfile.fromUser(savedUser);
  }
}
