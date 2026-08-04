import {
  Controller,
  Get,
  Patch,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/infrastructure/decorators/current-user.decorator';
import { PrismaService } from '../../database/prisma.service';

const DEFAULT_SETTINGS = {
  appearance: {
    theme: 'dark',
    density: 'comfortable',
    sidebarMode: 'expanded',
    animations: true,
  },
  editor: {
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    tabSize: 2,
    softTabs: true,
    wordWrap: 'on',
    lineNumbers: 'on',
    theme: 'vs-dark',
  },
  ai: {
    preferredModel: 'gemini-2.0-flash',
    reviewStyle: 'thorough',
    reviewDepth: 'detailed',
    explanationLevel: 'balanced',
    language: 'en',
    autoReview: true,
  },
  notifications: {
    email: true,
    browser: true,
    inApp: true,
    weeklyReport: true,
    securityAlerts: true,
    reviewCompleted: true,
    repositoryUpdates: false,
  },
  privacy: {
    profileVisibility: 'public',
    emailVisibility: 'private',
    activityVisibility: 'team',
    analytics: true,
  },
  security: {
    twoFactorEnabled: false,
  },
};

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getSettings(@CurrentUser('sub') userId: string) {
    let pref = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!pref) {
      pref = await this.prisma.userPreference.create({
        data: {
          userId,
          theme: 'dark',
          defaultAIProvider: 'gemini',
          notificationsEnabled: true,
          appearance: DEFAULT_SETTINGS.appearance,
          editor: DEFAULT_SETTINGS.editor,
          ai: DEFAULT_SETTINGS.ai,
          notifications: DEFAULT_SETTINGS.notifications,
          privacy: DEFAULT_SETTINGS.privacy,
          security: DEFAULT_SETTINGS.security,
        },
      });
    }

    return {
      appearance: pref.appearance || DEFAULT_SETTINGS.appearance,
      editor: pref.editor || DEFAULT_SETTINGS.editor,
      ai: pref.ai || DEFAULT_SETTINGS.ai,
      notifications: pref.notifications || DEFAULT_SETTINGS.notifications,
      privacy: pref.privacy || DEFAULT_SETTINGS.privacy,
      security: pref.security || DEFAULT_SETTINGS.security,
    };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateSettings(
    @CurrentUser('sub') userId: string,
    @Body() body: any,
  ) {
    const existing = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    const currentAppearance = (existing?.appearance as any) || DEFAULT_SETTINGS.appearance;
    const currentEditor = (existing?.editor as any) || DEFAULT_SETTINGS.editor;
    const currentAi = (existing?.ai as any) || DEFAULT_SETTINGS.ai;
    const currentNotifications = (existing?.notifications as any) || DEFAULT_SETTINGS.notifications;
    const currentPrivacy = (existing?.privacy as any) || DEFAULT_SETTINGS.privacy;
    const currentSecurity = (existing?.security as any) || DEFAULT_SETTINGS.security;

    const updated = await this.prisma.userPreference.upsert({
      where: { userId },
      update: {
        ...(body.theme && { theme: body.theme }),
        appearance: body.appearance ? { ...currentAppearance, ...body.appearance } : currentAppearance,
        editor: body.editor ? { ...currentEditor, ...body.editor } : currentEditor,
        ai: body.ai ? { ...currentAi, ...body.ai } : currentAi,
        notifications: body.notifications ? { ...currentNotifications, ...body.notifications } : currentNotifications,
        privacy: body.privacy ? { ...currentPrivacy, ...body.privacy } : currentPrivacy,
        security: body.security ? { ...currentSecurity, ...body.security } : currentSecurity,
      },
      create: {
        userId,
        theme: body.appearance?.theme || 'dark',
        appearance: body.appearance ? { ...DEFAULT_SETTINGS.appearance, ...body.appearance } : DEFAULT_SETTINGS.appearance,
        editor: body.editor ? { ...DEFAULT_SETTINGS.editor, ...body.editor } : DEFAULT_SETTINGS.editor,
        ai: body.ai ? { ...DEFAULT_SETTINGS.ai, ...body.ai } : DEFAULT_SETTINGS.ai,
        notifications: body.notifications ? { ...DEFAULT_SETTINGS.notifications, ...body.notifications } : DEFAULT_SETTINGS.notifications,
        privacy: body.privacy ? { ...DEFAULT_SETTINGS.privacy, ...body.privacy } : DEFAULT_SETTINGS.privacy,
        security: body.security ? { ...DEFAULT_SETTINGS.security, ...body.security } : DEFAULT_SETTINGS.security,
      },
    });

    return {
      appearance: updated.appearance,
      editor: updated.editor,
      ai: updated.ai,
      notifications: updated.notifications,
      privacy: updated.privacy,
      security: updated.security,
    };
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async replaceSettings(@CurrentUser('sub') userId: string, @Body() body: any) {
    return this.updateSettings(userId, body);
  }
}
