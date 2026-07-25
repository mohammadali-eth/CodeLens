import { Inject, Injectable } from '@nestjs/common';
import { IAnalyticsRepository } from '../ports/analytics-repository.interface';
import { UserDashboardSummary } from '../../domain/dashboard-analytics.value-objects';
import { DashboardFilterDto } from '../../infrastructure/controllers/dtos/dashboard-filter.dto';
import { RedisDashboardCacheService } from '../../infrastructure/cache/redis-dashboard-cache.service';

@Injectable()
export class GetDashboardSummaryUseCase {
  constructor(
    @Inject(IAnalyticsRepository)
    private readonly analyticsRepository: IAnalyticsRepository,
    private readonly cacheService: RedisDashboardCacheService,
  ) {}

  async execute(
    userId: string,
    filterDto?: DashboardFilterDto,
  ): Promise<UserDashboardSummary> {
    const cacheKey = this.cacheService.generateCacheKey(
      'summary',
      userId,
      filterDto as Record<string, unknown>,
    );
    const cached = await this.cacheService.get<UserDashboardSummary>(cacheKey);
    if (cached) {
      return cached;
    }

    const filters = {
      startDate: filterDto?.startDate
        ? new Date(filterDto.startDate)
        : undefined,
      endDate: filterDto?.endDate ? new Date(filterDto.endDate) : undefined,
      language: filterDto?.language,
      aiProvider: filterDto?.aiProvider,
      status: filterDto?.status,
    };

    const summary = await this.analyticsRepository.getUserSummary(
      userId,
      filters,
    );
    await this.cacheService.set(cacheKey, summary);
    return summary;
  }
}
