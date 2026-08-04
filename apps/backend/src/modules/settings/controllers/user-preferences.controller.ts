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
import { SettingsController } from './settings.controller';

/**
 * UserPreferencesController
 * Purpose: Exposes REST API endpoints for user preferences and code editor settings.
 * Endpoints:
 *  - GET /users/preferences & GET /users/editor-preferences
 *  - PATCH /users/preferences & PATCH /users/editor-preferences
 *  - PUT /users/preferences & PUT /users/editor-preferences
 */
@Controller(['users/preferences', 'users/editor-preferences'])
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
  constructor(private readonly settingsController: SettingsController) {}

  @Get()
  async getPreferences(@CurrentUser('sub') userId: string) {
    const settings = await this.settingsController.getSettings(userId);
    return settings;
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updatePreferences(@CurrentUser('sub') userId: string, @Body() body: any) {
    // Handle either direct editor DTO or full user settings payload
    const payload = body.wordWrap || body.fontFamily || body.tabSize ? { editor: body } : body;
    return this.settingsController.updateSettings(userId, payload);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async replacePreferences(@CurrentUser('sub') userId: string, @Body() body: any) {
    const payload = body.wordWrap || body.fontFamily || body.tabSize ? { editor: body } : body;
    return this.settingsController.updateSettings(userId, payload);
  }
}
