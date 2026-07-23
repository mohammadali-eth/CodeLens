import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../../auth/application/ports/user-repository.interface';
import { UserProfile } from '../../domain/user-profile.entity';

/**
 * GetUserProfileUseCase
 * Purpose: Self-service profile retrieval.
 * Responsibilities: Fetches active user data and maps to UserProfile.
 * Dependencies: IUserRepository.
 */
@Injectable()
export class GetUserProfileUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<UserProfile> {
    const user = await this.userRepository.findById(userId);
    if (!user || user.isDeleted()) {
      throw new NotFoundException(`User profile not found`);
    }
    return UserProfile.fromUser(user);
  }
}
