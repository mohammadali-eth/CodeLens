import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { AdminMonitoringController } from './infrastructure/controllers/admin-monitoring.controller';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AdminMonitoringController],
  exports: [],
})
export class MonitoringModule {}
