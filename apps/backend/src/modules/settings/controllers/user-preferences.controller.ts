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

@Controller('users/preferences')
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
  constructor(private readonly settingsController: SettingsController) {}

  @Get()
  async getPreferences(@CurrentUser('sub') userId: string) {
    return this.settingsController.getSettings(userId);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updatePreferences(@CurrentUser('sub') userId: string, @Body() body: any) {
    return this.settingsController.updateSettings(userId, body);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async replacePreferences(@CurrentUser('sub') userId: string, @Body() body: any) {
    return this.settingsController.updateSettings(userId, body);
  }
}
