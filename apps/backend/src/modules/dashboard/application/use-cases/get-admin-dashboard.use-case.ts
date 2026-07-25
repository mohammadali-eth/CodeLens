import { Inject, Injectable } from '@nestjs/common';
import { IAnalyticsRepository } from '../ports/analytics-repository.interface';
import { AdminDashboardSummary } from '../../domain/dashboard-analytics.value-objects';
import { RedisDashboardCacheService } from '../../infrastructure/cache/redis-dashboard-cache.service';

@Injectable()
export class GetAdminDashboardUseCase {
  constructor(
    @Inject(IAnalyticsRepository)
    private readonly analyticsRepository: IAnalyticsRepository,
    private readonly cacheService: RedisDashboardCacheService,
  ) {}

  async execute(): Promise<AdminDashboardSummary> {
    const cacheKey = this.cacheService.generateCacheKey('admin-summary');
    const cached = await this.cacheService.get<AdminDashboardSummary>(cacheKey);
    if (cached) {
      return cached;
    }

    const summary = await this.analyticsRepository.getAdminSummary();
    await this.cacheService.set(cacheKey, summary);
    return summary;
  }
}
