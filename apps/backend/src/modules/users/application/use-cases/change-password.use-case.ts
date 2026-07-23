import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IUserRepository } from '../../../auth/application/ports/user-repository.interface';
import { IPasswordHasher } from '../../../auth/application/ports/password-hasher.interface';
import { IRefreshTokenRepository } from '../../../auth/application/ports/refresh-token-repository.interface';
import { ChangePasswordDto } from '../../infrastructure/controllers/dtos/change-password.dto';

/**
 * ChangePasswordUseCase
 * Purpose: Secure self-service password changes.
 * Responsibilities: Verifies current password, updates hash, and revokes sessions.
 * Dependencies: IUserRepository, IPasswordHasher, IRefreshTokenRepository.
 */
@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ success: boolean }> {
    const user = await this.userRepository.findById(userId);
    if (!user || user.isDeleted()) {
      throw new NotFoundException(`User not found`);
    }

    const isCurrentPasswordValid = await this.passwordHasher.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password provided is incorrect');
    }

    const newPasswordHash = await this.passwordHasher.hash(dto.newPassword);
    const updatedUser = user.updatePassword(newPasswordHash);

    await this.userRepository.save(updatedUser);

    // Revoke all existing refresh token sessions for security
    await this.refreshTokenRepository.revokeAllUserTokens(userId);

    return { success: true };
  }
}
