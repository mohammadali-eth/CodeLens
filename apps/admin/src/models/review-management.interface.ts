/**
 * Review Management Domain Interfaces & DTO Models
 * Purpose: Defines strong TypeScript contracts for Phase A5 Review Management in the Vue Admin Portal.
 * Responsibilities: Provides data models for review directories, details, AI outputs, moderation, filters, bulk operations, and statistics.
 * Dependencies: Independent domain model contracts matching NestJS Backend APIs.
 */

export type ReviewStatus = 'COMPLETED' | 'PENDING' | 'PROCESSING' | 'FAILED' | 'ARCHIVED';

export type IssueSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type IssueCategory = 'BUG' | 'ERROR' | 'BEST_PRACTICE' | 'OPTIMIZATION' | 'SECURITY';

export interface ReviewIssue {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  title: string;
  description: string;
  lineStart?: number;
  lineEnd?: number;
  suggestion?: string;
}

export interface ReviewFileItem {
  id: string;
  filename: string;
  language: string;
  originalCode: string;
  improvedCode?: string;
  issues: ReviewIssue[];
}

export interface ProcessingLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  phase?: string;
  executionTimeMs?: number;
}

export interface AiProviderInfo {
  name: string;
  model: string;
  latencyMs: number;
  tokensUsed: number;
  promptTokens?: number;
  completionTokens?: number;
  costEstimate?: number;
}

export interface QualityMetrics {
  readability: number;
  maintainability: number;
  security: number;
  performance: number;
}

export interface AdminReviewItem {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  language: string;
  aiProvider: string;
  aiModel: string;
  status: ReviewStatus;
  score: number;
  processingTimeMs: number;
  createdAt: string;
  updatedAt: string;
  totalFiles?: number;
  totalIssues?: number;
  criticalIssues?: number;
  isFlagged?: boolean;
  isArchived?: boolean;
  isHidden?: boolean;
  moderatorNotes?: string;
}

export interface AdminReviewDetail extends AdminReviewItem {
  summary: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  bugsCount: number;
  errorsCount: number;
  bestPracticesCount: number;
  optimizationsCount: number;
  qualityMetrics: QualityMetrics;
  files: ReviewFileItem[];
  processingLogs: ProcessingLog[];
  aiProviderInfo: AiProviderInfo;
}

export interface ReviewQueryFilter {
  search?: string;
  status?: ReviewStatus | 'ALL';
  language?: string | 'ALL';
  aiProvider?: string | 'ALL';
  minScore?: number;
  maxScore?: number;
  startDate?: string;
  endDate?: string;
  failedOnly?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'score' | 'processingTimeMs';
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface PaginatedReviewsResponse {
  reviews: AdminReviewItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type BulkReviewActionType = 'delete' | 'archive' | 'restore' | 'rerun' | 'export';

export interface BulkReviewActionPayload {
  action: BulkReviewActionType;
  reviewIds: string[];
  reason?: string;
  aiProvider?: string;
}

export interface BulkReviewActionResult {
  success: boolean;
  affectedCount: number;
  failedIds?: string[];
  message: string;
}

export interface ModerationActionPayload {
  reviewId: string;
  isFlagged?: boolean;
  isHidden?: boolean;
  moderatorNotes?: string;
}

export interface ReviewProviderStat {
  provider: string;
  count: number;
  percentage: number;
}

export interface ReviewLanguageStat {
  language: string;
  count: number;
  percentage: number;
}

export interface AdminReviewStats {
  totalReviews: number;
  completedReviews: number;
  failedReviews: number;
  averageQualityScore: number;
  averageProcessingTimeMs: number;
  aiProviderDistribution: ReviewProviderStat[];
  languageDistribution: ReviewLanguageStat[];
}
