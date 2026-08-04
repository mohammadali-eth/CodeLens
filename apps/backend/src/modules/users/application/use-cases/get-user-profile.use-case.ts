import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { UserProfile } from '../../domain/user-profile.entity';

/**
 * GetUserProfileUseCase
 * Purpose: Self-service user profile retrieval.
 * Responsibilities: Fetches active user data from Prisma and maps to UserProfile.
 * Dependencies: PrismaService.
 */
@Injectable()
export class GetUserProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException(`User profile not found`);
    }

    return UserProfile.fromDbUser(user);
  }
}
