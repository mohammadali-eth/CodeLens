import { Inject, Injectable } from '@nestjs/common';
import { IAnalyticsRepository } from '../ports/analytics-repository.interface';
import { ProviderUsageStat } from '../../domain/dashboard-analytics.value-objects';
import { RedisDashboardCacheService } from '../../infrastructure/cache/redis-dashboard-cache.service';

@Injectable()
export class GetProviderUsageUseCase {
  constructor(
    @Inject(IAnalyticsRepository)
    private readonly analyticsRepository: IAnalyticsRepository,
    private readonly cacheService: RedisDashboardCacheService,
  ) {}

  async execute(userId?: string): Promise<ProviderUsageStat[]> {
    const cacheKey = this.cacheService.generateCacheKey('provider', userId);
    const cached = await this.cacheService.get<ProviderUsageStat[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const usage = await this.analyticsRepository.getProviderUsage(userId);
    await this.cacheService.set(cacheKey, usage);
    return usage;
  }
}
