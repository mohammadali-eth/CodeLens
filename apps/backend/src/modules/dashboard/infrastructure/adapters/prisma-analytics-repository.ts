import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import {
  DashboardFilterOptions,
  IAnalyticsRepository,
} from '../../application/ports/analytics-repository.interface';
import {
  UserDashboardSummary,
  AdminDashboardSummary,
  QualityTrendPoint,
  LanguageDistribution,
  ProviderUsageStat,
  ActivityTimelineItem,
} from '../../domain/dashboard-analytics.value-objects';
import {
  UserStatus,
  ProgrammingLanguage,
  ReviewStatus,
  Prisma,
} from '@prisma/client';

@Injectable()
export class PrismaAnalyticsRepository implements IAnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserSummary(
    userId: string,
    filters?: DashboardFilterOptions,
  ): Promise<UserDashboardSummary> {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const baseWhere: Prisma.ReviewWhereInput = {
      creatorId: userId,
      deletedAt: null,
      ...(filters?.language
        ? {
            files: {
              some: {
                language: filters.language as ProgrammingLanguage,
              },
            },
          }
        : {}),
      ...(filters?.aiProvider ? { aiProvider: filters.aiProvider } : {}),
      ...(filters?.status ? { status: filters.status as ReviewStatus } : {}),
      ...(filters?.startDate || filters?.endDate
        ? {
            createdAt: {
              ...(filters?.startDate
                ? { gte: new Date(filters.startDate) }
                : {}),
              ...(filters?.endDate ? { lte: new Date(filters.endDate) } : {}),
            },
          }
        : {}),
    };

    const [
      totalReviews,
      reviewsToday,
      reviewsThisWeek,
      reviewsThisMonth,
      aggregations,
      favoriteReviewsCount,
      chatSessionsCount,
      languageGroups,
    ] = await Promise.all([
      this.prisma.review.count({ where: baseWhere }),
      this.prisma.review.count({
        where: { ...baseWhere, createdAt: { gte: startOfToday } },
      }),
      this.prisma.review.count({
        where: { ...baseWhere, createdAt: { gte: startOfWeek } },
      }),
      this.prisma.review.count({
        where: { ...baseWhere, createdAt: { gte: startOfMonth } },
      }),
      this.prisma.review.aggregate({
        where: baseWhere,
        _avg: {
          score: true,
          processingTimeMs: true,
        },
      }),
      this.prisma.favoriteReview.count({ where: { userId } }),
      this.prisma.chatSession.count({ where: { userId, deletedAt: null } }),
      this.prisma.reviewFile.groupBy({
        by: ['language'],
        where: {
          review: { creatorId: userId, deletedAt: null },
        },
        _count: { language: true },
        orderBy: { _count: { language: 'desc' } },
        take: 1,
      }),
    ]);

    const mostUsedLanguage =
      languageGroups.length > 0 ? String(languageGroups[0].language) : null;
    const avgScore = aggregations._avg.score
      ? Math.round(aggregations._avg.score)
      : 0;
    const avgProcessingTimeMs = aggregations._avg.processingTimeMs
      ? Math.round(aggregations._avg.processingTimeMs)
      : 0;

    return new UserDashboardSummary(
      totalReviews,
      reviewsToday,
      reviewsThisWeek,
      reviewsThisMonth,
      avgScore,
      avgProcessingTimeMs,
      mostUsedLanguage,
      favoriteReviewsCount,
      chatSessionsCount,
    );
  }

  async getAdminSummary(): Promise<AdminDashboardSummary> {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      activeUsers,
      newRegistrationsThisMonth,
      totalReviews,
      reviewsToday,
      scoreAggregate,
      mostActiveUserGroup,
      topLanguageGroup,
      topProviderGroup,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({
        where: { status: UserStatus.ACTIVE, deletedAt: null },
      }),
      this.prisma.user.count({
        where: { createdAt: { gte: startOfMonth }, deletedAt: null },
      }),
      this.prisma.review.count({ where: { deletedAt: null } }),
      this.prisma.review.count({
        where: { createdAt: { gte: startOfToday }, deletedAt: null },
      }),
      this.prisma.review.aggregate({
        where: { deletedAt: null },
        _avg: { score: true },
      }),
      this.prisma.review.groupBy({
        by: ['creatorId'],
        where: { deletedAt: null },
        _count: { creatorId: true },
        orderBy: { _count: { creatorId: 'desc' } },
        take: 1,
      }),
      this.prisma.reviewFile.groupBy({
        by: ['language'],
        _count: { language: true },
        orderBy: { _count: { language: 'desc' } },
        take: 1,
      }),
      this.prisma.review.groupBy({
        by: ['aiProvider'],
        where: { deletedAt: null },
        _count: { aiProvider: true },
        orderBy: { _count: { aiProvider: 'desc' } },
        take: 1,
      }),
    ]);

    let mostActiveUser: {
      id: string;
      name: string | null;
      email: string;
      reviewsCount: number;
    } | null = null;
    if (mostActiveUserGroup.length > 0) {
      const topUserId = mostActiveUserGroup[0].creatorId;
      const user = await this.prisma.user.findUnique({
        where: { id: topUserId },
      });
      if (user) {
        mostActiveUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          reviewsCount: mostActiveUserGroup[0]._count.creatorId,
        };
      }
    }

    const globalAvgScore = scoreAggregate._avg.score
      ? Math.round(scoreAggregate._avg.score)
      : 0;
    const mostPopularLanguage =
      topLanguageGroup.length > 0 ? String(topLanguageGroup[0].language) : null;
    const mostUsedAIProvider =
      topProviderGroup.length > 0 ? topProviderGroup[0].aiProvider : null;

    return new AdminDashboardSummary(
      totalUsers,
      activeUsers,
      newRegistrationsThisMonth,
      totalReviews,
      reviewsToday,
      globalAvgScore,
      mostActiveUser,
      mostPopularLanguage,
      mostUsedAIProvider,
    );
  }

  async getQualityTrend(
    userId?: string,
    days = 30,
  ): Promise<QualityTrendPoint[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const reviews = await this.prisma.review.findMany({
      where: {
        ...(userId ? { creatorId: userId } : {}),
        createdAt: { gte: startDate },
        deletedAt: null,
      },
      select: {
        score: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const dateMap = new Map<string, { totalScore: number; count: number }>();
    for (const r of reviews) {
      const dateStr = r.createdAt.toISOString().split('T')[0];
      const existing = dateMap.get(dateStr) || { totalScore: 0, count: 0 };
      dateMap.set(dateStr, {
        totalScore: existing.totalScore + (r.score || 0),
        count: existing.count + 1,
      });
    }

    const trendPoints: QualityTrendPoint[] = [];
    for (const [date, data] of dateMap.entries()) {
      trendPoints.push(
        new QualityTrendPoint(
          date,
          data.count > 0 ? Math.round(data.totalScore / data.count) : 0,
          data.count,
        ),
      );
    }

    return trendPoints;
  }

  async getLanguageStats(userId?: string): Promise<LanguageDistribution[]> {
    const languageGroups = await this.prisma.reviewFile.groupBy({
      by: ['language'],
      where: {
        ...(userId ? { review: { creatorId: userId, deletedAt: null } } : {}),
      },
      _count: { language: true },
      orderBy: { _count: { language: 'desc' } },
    });

    const totalFiles = languageGroups.reduce(
      (acc, g) => acc + g._count.language,
      0,
    );

    return languageGroups.map((g) => {
      const count = g._count.language;
      const percentage =
        totalFiles > 0 ? Math.round((count / totalFiles) * 100) : 0;
      return new LanguageDistribution(String(g.language), count, percentage);
    });
  }

  async getProviderUsage(userId?: string): Promise<ProviderUsageStat[]> {
    const providerGroups = await this.prisma.review.groupBy({
      by: ['aiProvider'],
      where: {
        ...(userId ? { creatorId: userId } : {}),
        deletedAt: null,
      },
      _count: { aiProvider: true },
      orderBy: { _count: { aiProvider: 'desc' } },
    });

    const totalReviews = providerGroups.reduce(
      (acc, g) => acc + g._count.aiProvider,
      0,
    );

    return providerGroups.map((g) => {
      const count = g._count.aiProvider;
      const percentage =
        totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
      return new ProviderUsageStat(g.aiProvider, count, percentage);
    });
  }

  async getRecentActivities(
    userId?: string,
    limit = 20,
  ): Promise<ActivityTimelineItem[]> {
    const activities = await this.prisma.activity.findMany({
      where: {
        ...(userId ? { userId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return activities.map(
      (act) =>
        new ActivityTimelineItem(
          act.id,
          act.action,
          act.details,
          act.createdAt,
        ),
    );
  }
}
