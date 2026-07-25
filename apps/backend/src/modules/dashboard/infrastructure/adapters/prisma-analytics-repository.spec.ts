/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/// <reference types="jest" />

import { PrismaAnalyticsRepository } from './prisma-analytics-repository';
import { PrismaService } from '../../../database/prisma.service';

describe('PrismaAnalyticsRepository', () => {
  let repository: PrismaAnalyticsRepository;
  let prismaMock: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prismaMock = {
      review: {
        count: jest.fn().mockResolvedValue(10),
        aggregate: jest.fn().mockResolvedValue({
          _avg: { score: 88, processingTimeMs: 1200 },
        }),
        groupBy: jest.fn().mockResolvedValue([
          { aiProvider: 'gemini', _count: { aiProvider: 7 } },
          { aiProvider: 'openai', _count: { aiProvider: 3 } },
        ]),
        findMany: jest.fn().mockResolvedValue([
          { score: 85, createdAt: new Date('2026-07-20') },
          { score: 90, createdAt: new Date('2026-07-21') },
        ]),
      },
      favoriteReview: {
        count: jest.fn().mockResolvedValue(3),
      },
      chatSession: {
        count: jest.fn().mockResolvedValue(5),
      },
      reviewFile: {
        groupBy: jest
          .fn()
          .mockResolvedValue([
            { language: 'TYPESCRIPT', _count: { language: 8 } },
          ]),
      },
      user: {
        count: jest.fn().mockResolvedValue(25),
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          name: 'Staff Engineer',
          email: 'staff@codelens.ai',
        }),
      },
      activity: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'act-1',
            userId: 'user-1',
            action: 'REVIEW_CREATED',
            details: 'Reviewed AuthModule',
            createdAt: new Date(),
          },
        ]),
      },
    } as any;

    repository = new PrismaAnalyticsRepository(prismaMock);
  });

  it('should return aggregated user summary metrics', async () => {
    const summary = await repository.getUserSummary('user-1');

    expect(summary.totalReviews).toBe(10);
    expect(summary.averageQualityScore).toBe(88);
    expect(summary.averageProcessingTimeMs).toBe(1200);
    expect(summary.mostUsedLanguage).toBe('TYPESCRIPT');
    expect(summary.favoriteReviewsCount).toBe(3);
    expect(summary.chatSessionsCount).toBe(5);
  });

  it('should return quality trend points', async () => {
    const trend = await repository.getQualityTrend('user-1', 30);

    expect(trend.length).toBeGreaterThan(0);
    expect(trend[0].averageScore).toBe(85);
  });

  it('should return language statistics distribution', async () => {
    const stats = await repository.getLanguageStats('user-1');

    expect(stats.length).toBe(1);
    expect(stats[0].language).toBe('TYPESCRIPT');
    expect(stats[0].percentage).toBe(100);
  });

  it('should return AI provider usage statistics', async () => {
    const usage = await repository.getProviderUsage('user-1');

    expect(usage.length).toBe(2);
    expect(usage[0].provider).toBe('gemini');
    expect(usage[0].percentage).toBe(70);
  });
});
