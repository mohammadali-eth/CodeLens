/**
 * UserDashboardSummary Value Object
 * Encapsulates high-level analytics KPIs for an individual user dashboard view.
 */
export class UserDashboardSummary {
  constructor(
    public readonly totalReviews: number,
    public readonly reviewsToday: number,
    public readonly reviewsThisWeek: number,
    public readonly reviewsThisMonth: number,
    public readonly averageQualityScore: number,
    public readonly averageProcessingTimeMs: number,
    public readonly mostUsedLanguage: string | null,
    public readonly favoriteReviewsCount: number,
    public readonly chatSessionsCount: number,
  ) {}
}

/**
 * AdminDashboardSummary Value Object
 * Encapsulates system-wide platform statistics for administrator dashboard.
 */
export class AdminDashboardSummary {
  constructor(
    public readonly totalUsers: number,
    public readonly activeUsers: number,
    public readonly newRegistrationsThisMonth: number,
    public readonly totalReviews: number,
    public readonly reviewsToday: number,
    public readonly globalAverageQualityScore: number,
    public readonly mostActiveUser: {
      id: string;
      name: string | null;
      email: string;
      reviewsCount: number;
    } | null,
    public readonly mostPopularLanguage: string | null,
    public readonly mostUsedAIProvider: string | null,
  ) {}
}

/**
 * QualityTrendPoint Value Object
 * Time-series data point for quality score history line charts.
 */
export class QualityTrendPoint {
  constructor(
    public readonly date: string, // YYYY-MM-DD
    public readonly averageScore: number,
    public readonly reviewCount: number,
  ) {}
}

/**
 * LanguageDistribution Value Object
 * Categorical metrics for programming language usage bar/doughnut charts.
 */
export class LanguageDistribution {
  constructor(
    public readonly language: string,
    public readonly count: number,
    public readonly percentage: number,
  ) {}
}

/**
 * ProviderUsageStat Value Object
 * Distribution metrics for AI Providers (Gemini, OpenAI, Ollama, Mock).
 */
export class ProviderUsageStat {
  constructor(
    public readonly provider: string,
    public readonly count: number,
    public readonly percentage: number,
  ) {}
}

/**
 * ActivityTimelineItem Value Object
 * Timeline feed items for recent user and system events.
 */
export class ActivityTimelineItem {
  constructor(
    public readonly id: string,
    public readonly action: string,
    public readonly details: string | null,
    public readonly createdAt: Date,
  ) {}
}
