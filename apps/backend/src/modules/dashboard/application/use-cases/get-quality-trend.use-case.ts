import { Inject, Injectable } from '@nestjs/common';
import { IAnalyticsRepository } from '../ports/analytics-repository.interface';
import { QualityTrendPoint } from '../../domain/dashboard-analytics.value-objects';
import { RedisDashboardCacheService } from '../../infrastructure/cache/redis-dashboard-cache.service';

@Injectable()
export class GetQualityTrendUseCase {
  constructor(
    @Inject(IAnalyticsRepository)
    private readonly analyticsRepository: IAnalyticsRepository,
    private readonly cacheService: RedisDashboardCacheService,
  ) {}

  async execute(userId?: string, days = 30): Promise<QualityTrendPoint[]> {
    const cacheKey = this.cacheService.generateCacheKey('trend', userId, {
      days,
    });
    const cached = await this.cacheService.get<QualityTrendPoint[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const trend = await this.analyticsRepository.getQualityTrend(userId, days);
    await this.cacheService.set(cacheKey, trend);
    return trend;
  }
}
