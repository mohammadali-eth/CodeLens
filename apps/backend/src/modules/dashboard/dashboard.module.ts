import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ReviewModule } from '../review/review.module';
import { IAnalyticsRepository } from './application/ports/analytics-repository.interface';
import { PrismaAnalyticsRepository } from './infrastructure/adapters/prisma-analytics-repository';
import { RedisDashboardCacheService } from './infrastructure/cache/redis-dashboard-cache.service';
import { GetDashboardSummaryUseCase } from './application/use-cases/get-dashboard-summary.use-case';
import { GetQualityTrendUseCase } from './application/use-cases/get-quality-trend.use-case';
import { GetLanguageStatsUseCase } from './application/use-cases/get-language-stats.use-case';
import { GetProviderUsageUseCase } from './application/use-cases/get-provider-usage.use-case';
import { GetRecentActivityUseCase } from './application/use-cases/get-recent-activity.use-case';
import { GetAdminDashboardUseCase } from './application/use-cases/get-admin-dashboard.use-case';
import { DashboardController } from './infrastructure/controllers/dashboard.controller';

@Module({
  imports: [AuthModule, ReviewModule],
  controllers: [DashboardController],
  providers: [
    {
      provide: IAnalyticsRepository,
      useClass: PrismaAnalyticsRepository,
    },
    RedisDashboardCacheService,
    GetDashboardSummaryUseCase,
    GetQualityTrendUseCase,
    GetLanguageStatsUseCase,
    GetProviderUsageUseCase,
    GetRecentActivityUseCase,
    GetAdminDashboardUseCase,
  ],
  exports: [
    IAnalyticsRepository,
    RedisDashboardCacheService,
    GetDashboardSummaryUseCase,
    GetQualityTrendUseCase,
    GetLanguageStatsUseCase,
    GetProviderUsageUseCase,
    GetRecentActivityUseCase,
    GetAdminDashboardUseCase,
  ],
})
export class DashboardModule {}
