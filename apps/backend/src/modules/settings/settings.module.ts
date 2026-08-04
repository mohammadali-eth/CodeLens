import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { SettingsController } from './controllers/settings.controller';
import { UserPreferencesController } from './controllers/user-preferences.controller';
import { SessionsController } from './controllers/sessions.controller';
import { ApiKeysController } from './controllers/api-keys.controller';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [
    SettingsController,
    UserPreferencesController,
    SessionsController,
    ApiKeysController,
  ],
  providers: [SettingsController],
})
export class SettingsModule {}
