import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { IRefreshTokenRepository } from '../../application/ports/refresh-token-repository.interface';
import { RefreshToken } from '../../domain/refresh-token.entity';

/**
 * PrismaRefreshTokenRepository Adapter
 * Purpose: Manages refresh token persistence in PostgreSQL via Prisma.
 * Responsibilities: Implements token queries, state updates, and security family revocations.
 * Dependencies: PrismaService, IRefreshTokenRepository, RefreshToken domain entity.
 */
@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(dbToken: any): RefreshToken {
    return new RefreshToken(
      dbToken.id,
      dbToken.token,
      dbToken.userId,
      dbToken.family,
      dbToken.isRevoked,
      dbToken.expiresAt,
      dbToken.createdAt,
      dbToken.updatedAt,
    );
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const dbToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });
    return dbToken ? this.mapToDomain(dbToken) : null;
  }

  async save(refreshToken: RefreshToken): Promise<RefreshToken> {
    const dbToken = await this.prisma.refreshToken.upsert({
      where: { id: refreshToken.id },
      update: {
        token: refreshToken.token,
        isRevoked: refreshToken.isRevoked,
        expiresAt: refreshToken.expiresAt,
      },
      create: {
        id: refreshToken.id,
        token: refreshToken.token,
        userId: refreshToken.userId,
        family: refreshToken.family,
        isRevoked: refreshToken.isRevoked,
        expiresAt: refreshToken.expiresAt,
      },
    });
    return this.mapToDomain(dbToken);
  }

  async revokeToken(id: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { isRevoked: true },
    });
  }

  async revokeFamily(family: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { family },
      data: { isRevoked: true },
    });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }
}
