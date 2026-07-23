import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../auth/application/ports/user-repository.interface';
import { UserProfile } from '../../domain/user-profile.entity';

/**
 * AdminListUsersUseCase
 * Purpose: Provides paginated user listings for administrative portals.
 * Responsibilities: Queries repository and returns user profile DTOs.
 * Dependencies: IUserRepository.
 */
@Injectable()
export class AdminListUsersUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    skip = 0,
    take = 20,
  ): Promise<{ users: UserProfile[]; total: number }> {
    const { users, total } = await this.userRepository.findAll({ skip, take });
    return {
      users: users.map((u) => UserProfile.fromUser(u)),
      total,
    };
  }
}
