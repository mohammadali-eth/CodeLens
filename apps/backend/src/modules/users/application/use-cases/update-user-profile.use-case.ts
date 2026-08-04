import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { UpdateProfileDto } from '../../infrastructure/controllers/dtos/update-profile.dto';
import { UserProfile } from '../../domain/user-profile.entity';

/**
 * UpdateUserProfileUseCase
 * Purpose: Self-service profile updates.
 * Responsibilities: Enforces username/email uniqueness constraints and persists changes in Prisma.
 * Dependencies: PrismaService.
 */
@Injectable()
export class UpdateUserProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, dto: UpdateProfileDto): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException(`User not found`);
    }

    // Check username uniqueness if changed
    if (dto.username && dto.username !== user.username) {
      const existingUsername = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });
      if (existingUsername && existingUsername.id !== userId) {
        throw new ConflictException(`Username '@${dto.username}' is already taken`);
      }
    }

    // Check email uniqueness if changed
    if (dto.email && dto.email !== user.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existingEmail && existingEmail.id !== userId) {
        throw new ConflictException(`Email address '${dto.email}' is already registered`);
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.username !== undefined && { username: dto.username }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.company !== undefined && { company: dto.company }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.website !== undefined && { website: dto.website }),
        ...(dto.timeZone !== undefined && { timeZone: dto.timeZone }),
        ...(dto.language !== undefined && { language: dto.language }),
        ...(dto.dateFormat !== undefined && { dateFormat: dto.dateFormat }),
        ...(dto.timeFormat !== undefined && { timeFormat: dto.timeFormat }),
      },
    });

    return UserProfile.fromDbUser(updatedUser);
  }
}
