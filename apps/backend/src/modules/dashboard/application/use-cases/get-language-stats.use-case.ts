import { Inject, Injectable } from '@nestjs/common';
import { IAnalyticsRepository } from '../ports/analytics-repository.interface';
import { LanguageDistribution } from '../../domain/dashboard-analytics.value-objects';
import { RedisDashboardCacheService } from '../../infrastructure/cache/redis-dashboard-cache.service';

@Injectable()
export class GetLanguageStatsUseCase {
  constructor(
    @Inject(IAnalyticsRepository)
    private readonly analyticsRepository: IAnalyticsRepository,
    private readonly cacheService: RedisDashboardCacheService,
  ) {}

  async execute(userId?: string): Promise<LanguageDistribution[]> {
    const cacheKey = this.cacheService.generateCacheKey('lang', userId);
    const cached =
      await this.cacheService.get<LanguageDistribution[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const stats = await this.analyticsRepository.getLanguageStats(userId);
    await this.cacheService.set(cacheKey, stats);
    return stats;
  }
}
