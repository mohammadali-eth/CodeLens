export class UserDashboardSummaryResponseDto {
  totalReviews!: number;
  reviewsToday!: number;
  reviewsThisWeek!: number;
  reviewsThisMonth!: number;
  averageQualityScore!: number;
  averageProcessingTimeMs!: number;
  mostUsedLanguage!: string | null;
  favoriteReviewsCount!: number;
  chatSessionsCount!: number;
}

export class AdminDashboardSummaryResponseDto {
  totalUsers!: number;
  activeUsers!: number;
  newRegistrationsThisMonth!: number;
  totalReviews!: number;
  reviewsToday!: number;
  globalAverageQualityScore!: number;
  mostActiveUser!: {
    id: string;
    name: string | null;
    email: string;
    reviewsCount: number;
  } | null;
  mostPopularLanguage!: string | null;
  mostUsedAIProvider!: string | null;
}

export class QualityTrendPointDto {
  date!: string;
  averageScore!: number;
  reviewCount!: number;
}

export class LanguageDistributionDto {
  language!: string;
  count!: number;
  percentage!: number;
}

export class ProviderUsageStatDto {
  provider!: string;
  count!: number;
  percentage!: number;
}

export class ActivityTimelineItemDto {
  id!: string;
  action!: string;
  details!: string | null;
  createdAt!: Date;
}
