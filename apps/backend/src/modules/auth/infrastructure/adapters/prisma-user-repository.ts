import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { User } from '../../domain/user.entity';
import { UserRole } from '../../domain/user-role.enum';
import { UserStatus } from '../../domain/user-status.enum';
import { IUserRepository } from '../../application/ports/user-repository.interface';
import { User as DbUser } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(dbUser: DbUser): User {
    return new User(
      dbUser.id,
      dbUser.email,
      dbUser.password, // Maps DB password storage to domain's passwordHash field
      dbUser.name,
      dbUser.role as UserRole,
      dbUser.status as UserStatus,
      dbUser.createdAt,
      dbUser.updatedAt,
      dbUser.deletedAt,
    );
  }

  async findById(id: string): Promise<User | null> {
    const dbUser = await this.prisma.user.findUnique({
      where: { id },
    });
    return dbUser ? this.mapToDomain(dbUser) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const dbUser = await this.prisma.user.findFirst({
      where: { email },
    });
    return dbUser ? this.mapToDomain(dbUser) : null;
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
  }): Promise<{ users: User[]; total: number }> {
    const skip = options?.skip || 0;
    const take = options?.take || 20;

    const [dbUsers, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users: dbUsers.map((u) => this.mapToDomain(u)),
      total,
    };
  }

  async save(user: User): Promise<User> {
    const dbUser = await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        password: user.passwordHash,
        name: user.name,
        role: user.role,
        status: user.status,
        deletedAt: user.deletedAt,
      },
      create: {
        id: user.id,
        email: user.email,
        password: user.passwordHash,
        name: user.name,
        role: user.role,
        status: user.status,
        deletedAt: user.deletedAt,
      },
    });

    // Proactively initialize default preferences for new users
    await this.prisma.userPreference.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        theme: 'dark',
        defaultAIProvider: 'gemini',
        notificationsEnabled: true,
      },
    });

    return this.mapToDomain(dbUser);
  }
}
