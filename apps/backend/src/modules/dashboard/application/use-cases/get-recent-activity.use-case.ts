import { Inject, Injectable } from '@nestjs/common';
import { IAnalyticsRepository } from '../ports/analytics-repository.interface';
import { ActivityTimelineItem } from '../../domain/dashboard-analytics.value-objects';

@Injectable()
export class GetRecentActivityUseCase {
  constructor(
    @Inject(IAnalyticsRepository)
    private readonly analyticsRepository: IAnalyticsRepository,
  ) {}

  async execute(userId?: string, limit = 20): Promise<ActivityTimelineItem[]> {
    return this.analyticsRepository.getRecentActivities(userId, limit);
  }
}
