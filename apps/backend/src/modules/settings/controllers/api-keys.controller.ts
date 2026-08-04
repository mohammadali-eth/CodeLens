import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/infrastructure/decorators/current-user.decorator';
import { PrismaService } from '../../database/prisma.service';
import * as crypto from 'crypto';

@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getApiKeys(@CurrentUser('sub') userId: string) {
    const keys = await this.prisma.userApiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return keys;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createApiKey(
    @CurrentUser('sub') userId: string,
    @Body() body: { name: string; permissions?: string[]; expirationDays?: number },
  ) {
    if (!body.name) {
      throw new BadRequestException('API Key name is required');
    }

    const randomSecret = `cdl_live_${crypto.randomBytes(16).toString('hex')}`;
    const keyHint = `${randomSecret.substring(0, 8)}...${randomSecret.substring(randomSecret.length - 4)}`;
    const keyHash = crypto.createHash('sha256').update(randomSecret).digest('hex');

    const expiresAt = body.expirationDays
      ? new Date(Date.now() + 86400000 * body.expirationDays)
      : null;

    const newKey = await this.prisma.userApiKey.create({
      data: {
        userId,
        name: body.name,
        keyHint,
        keyHash,
        permissions: body.permissions || ['*'],
        expiresAt,
        status: 'ACTIVE',
      },
    });

    return { key: newKey, secret: randomSecret };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async revokeApiKey(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    await this.prisma.userApiKey.deleteMany({
      where: { id, userId },
    });
    return { success: true, message: 'API key revoked' };
  }
}
