import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { User } from '../../domain/user.entity';
import { Role } from '../../domain/role.enum';
import { IUserRepository } from '../../application/ports/user-repository.interface';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(dbUser: any): User {
    return new User(
      dbUser.id,
      dbUser.email,
      dbUser.password, // Maps DB password storage to domain's passwordHash field
      dbUser.name,
      dbUser.role as Role,
      dbUser.createdAt,
      dbUser.updatedAt,
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

  async save(user: User): Promise<User> {
    const dbUser = await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        password: user.passwordHash,
        name: user.name,
        role: user.role,
      },
      create: {
        id: user.id,
        email: user.email,
        password: user.passwordHash,
        name: user.name,
        role: user.role,
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
