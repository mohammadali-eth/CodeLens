import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/infrastructure/decorators/current-user.decorator';
import { PrismaService } from '../../database/prisma.service';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getSessions(@CurrentUser('sub') userId: string, @Req() req: any) {
    let sessions = await this.prisma.userSession.findMany({
      where: { userId },
      orderBy: { lastActiveAt: 'desc' },
    });

    if (sessions.length === 0) {
      const userAgent = req.headers['user-agent'] || 'Unknown Browser';
      const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';

      const currentSession = await this.prisma.userSession.create({
        data: {
          userId,
          deviceName: userAgent.includes('Mac') ? 'MacBook Pro' : 'Linux Workstation',
          browser: userAgent.includes('Chrome') ? 'Chrome' : 'Firefox',
          os: userAgent.includes('Mac') ? 'macOS' : 'Linux',
          ipAddress: ip,
          location: 'Local Workspace',
          isCurrent: true,
        },
      });
      sessions = [currentSession];
    }

    return sessions;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async revokeSession(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    await this.prisma.userSession.deleteMany({
      where: { id, userId },
    });
    return { success: true, message: 'Session revoked', revokedId: id };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async revokeAllOtherSessions(@CurrentUser('sub') userId: string) {
    await this.prisma.userSession.deleteMany({
      where: { userId, isCurrent: false },
    });
    return { success: true, message: 'All other sessions terminated' };
  }
}
