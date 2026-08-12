import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDashboardSummary {
  totalReviews: number;
  reviewsToday: number;
  reviewsThisWeek: number;
  reviewsThisMonth: number;
  averageQualityScore: number;
  averageProcessingTimeMs: number;
  mostUsedLanguage: string | null;
  favoriteReviewsCount: number;
  chatSessionsCount: number;
}

export interface QualityTrendPoint {
  date: string;
  averageScore: number;
  reviewCount: number;
}

export interface LanguageDistribution {
  language: string;
  count: number;
  percentage: number;
}

export interface ProviderUsageStat {
  provider: string;
  count: number;
  percentage: number;
}

export interface ActivityTimelineItem {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
}

export interface AdminDashboardSummary {
  totalUsers: number;
  activeUsers: number;
  newRegistrationsThisMonth: number;
  totalReviews: number;
  reviewsToday: number;
  globalAverageQualityScore: number;
  mostActiveUser: { id: string; name: string | null; email: string; reviewsCount: number } | null;
  mostPopularLanguage: string | null;
  mostUsedAIProvider: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly baseUrl = 'http://localhost:4000/dashboard';

  constructor(private readonly http: HttpClient) {}

  getSummary(filters?: {
    startDate?: string;
    endDate?: string;
    language?: string;
    aiProvider?: string;
    status?: string;
  }): Observable<UserDashboardSummary> {
    let params = new HttpParams();
    if (filters?.startDate) params = params.set('startDate', filters.startDate);
    if (filters?.endDate) params = params.set('endDate', filters.endDate);
    if (filters?.language) params = params.set('language', filters.language);
    if (filters?.aiProvider) params = params.set('aiProvider', filters.aiProvider);
    if (filters?.status) params = params.set('status', filters.status);

    return this.http.get<UserDashboardSummary>(`${this.baseUrl}/summary`, { params });
  }

  getQualityTrend(days = 30): Observable<QualityTrendPoint[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<QualityTrendPoint[]>(`${this.baseUrl}/quality-trend`, { params });
  }

  getLanguageStats(): Observable<LanguageDistribution[]> {
    return this.http.get<LanguageDistribution[]>(`${this.baseUrl}/language-stats`);
  }

  getProviderUsage(): Observable<ProviderUsageStat[]> {
    return this.http.get<ProviderUsageStat[]>(`${this.baseUrl}/provider-usage`);
  }

  getRecentActivity(limit = 20): Observable<ActivityTimelineItem[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<ActivityTimelineItem[]>(`${this.baseUrl}/recent-activity`, { params });
  }

  getAdminSummary(): Observable<AdminDashboardSummary> {
    return this.http.get<AdminDashboardSummary>(`${this.baseUrl}/admin-summary`);
  }
}
