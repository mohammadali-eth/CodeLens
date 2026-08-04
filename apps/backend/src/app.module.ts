import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ReviewModule } from './modules/review/review.module';
import { UploadModule } from './modules/upload/upload.module';
import { AIModule } from './modules/ai/ai.module';
import { ChatModule } from './modules/chat/chat.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { AdminSystemController } from './modules/admin/application/controllers/admin-system.controller';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    SettingsModule,
    ReviewModule,
    UploadModule,
    AIModule,
    ChatModule,
    DashboardModule,
    MonitoringModule,
  ],
  controllers: [AppController, AdminSystemController],
  providers: [AppService],
})
export class AppModule {}
