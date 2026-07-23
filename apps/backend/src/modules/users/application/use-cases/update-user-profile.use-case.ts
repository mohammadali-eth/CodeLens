import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../../auth/application/ports/user-repository.interface';
import { UpdateProfileDto } from '../../infrastructure/controllers/dtos/update-profile.dto';
import { UserProfile } from '../../domain/user-profile.entity';

/**
 * UpdateUserProfileUseCase
 * Purpose: Allows users to update profile metadata.
 * Responsibilities: Enforces domain updates and saves changes.
 * Dependencies: IUserRepository.
 */
@Injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, dto: UpdateProfileDto): Promise<UserProfile> {
    const user = await this.userRepository.findById(userId);
    if (!user || user.isDeleted()) {
      throw new NotFoundException(`User not found`);
    }

    const updatedUser = user.updateProfile(dto.name);
    const savedUser = await this.userRepository.save(updatedUser);

    return UserProfile.fromUser(savedUser);
  }
}
