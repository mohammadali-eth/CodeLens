import { ReviewStatus } from './review-status.enum';
import { ReviewFile } from './review-file.entity';
import { Severity } from './severity.enum';

/**
 * Review Entity (Aggregate Root)
 * Purpose: Domain Aggregate representing an entire code review analysis request.
 * Responsibilities: Manages state transitions, enforces file collection rules, and computes overall quality metrics.
 * Dependencies: ReviewStatus, ReviewFile, Severity.
 * Future Extensibility: Supports re-analysis lineage tracking and workspace policy enforcement.
 */
export class Review {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly repository: string | null,
    public readonly branch: string | null,
    public readonly status: ReviewStatus,
    public readonly score: number | null,
    public readonly summary: string | null,
    public readonly timeComplexity: string | null,
    public readonly spaceComplexity: string | null,
    public readonly aiProvider: string,
    public readonly aiModel: string | null,
    public readonly processingTimeMs: number | null,
    public readonly creatorId: string,
    public readonly parentReviewId: string | null = null,
    public readonly chatSessionId: string | null = null,
    public readonly workspaceId: string | null = null,
    public readonly files: ReviewFile[] = [],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly deletedAt: Date | null = null,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Review title cannot be empty');
    }
    if (!this.creatorId) {
      throw new Error('Review must have a valid creator ID');
    }
    if (this.score !== null && (this.score < 0 || this.score > 100)) {
      throw new Error('Quality score must be between 0 and 100');
    }
  }

  public isCompleted(): boolean {
    return this.status === ReviewStatus.COMPLETED;
  }

  public isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  public markQueued(): Review {
    return new Review(
      this.id,
      this.title,
      this.description,
      this.repository,
      this.branch,
      ReviewStatus.QUEUED,
      this.score,
      this.summary,
      this.timeComplexity,
      this.spaceComplexity,
      this.aiProvider,
      this.aiModel,
      this.processingTimeMs,
      this.creatorId,
      this.parentReviewId,
      this.chatSessionId,
      this.workspaceId,
      this.files,
      this.createdAt,
      new Date(),
      this.deletedAt,
    );
  }

  public markProcessing(): Review {
    return new Review(
      this.id,
      this.title,
      this.description,
      this.repository,
      this.branch,
      ReviewStatus.PROCESSING,
      this.score,
      this.summary,
      this.timeComplexity,
      this.spaceComplexity,
      this.aiProvider,
      this.aiModel,
      this.processingTimeMs,
      this.creatorId,
      this.parentReviewId,
      this.chatSessionId,
      this.workspaceId,
      this.files,
      this.createdAt,
      new Date(),
      this.deletedAt,
    );
  }

  public completeAnalysis(
    summary: string,
    score: number,
    timeComplexity: string | null,
    spaceComplexity: string | null,
    processingTimeMs: number,
    files: ReviewFile[],
    aiModel?: string,
  ): Review {
    return new Review(
      this.id,
      this.title,
      this.description,
      this.repository,
      this.branch,
      ReviewStatus.COMPLETED,
      Math.min(100, Math.max(0, score)),
      summary,
      timeComplexity,
      spaceComplexity,
      this.aiProvider,
      aiModel || this.aiModel,
      processingTimeMs,
      this.creatorId,
      this.parentReviewId,
      this.chatSessionId,
      this.workspaceId,
      files,
      this.createdAt,
      new Date(),
      this.deletedAt,
    );
  }

  public failAnalysis(errorMessage: string): Review {
    return new Review(
      this.id,
      this.title,
      this.description,
      this.repository,
      this.branch,
      ReviewStatus.FAILED,
      null,
      `Analysis Failed: ${errorMessage}`,
      null,
      null,
      this.aiProvider,
      this.aiModel,
      null,
      this.creatorId,
      this.parentReviewId,
      this.chatSessionId,
      this.workspaceId,
      this.files,
      this.createdAt,
      new Date(),
      this.deletedAt,
    );
  }

  public softDelete(): Review {
    return new Review(
      this.id,
      this.title,
      this.description,
      this.repository,
      this.branch,
      ReviewStatus.CANCELLED,
      this.score,
      this.summary,
      this.timeComplexity,
      this.spaceComplexity,
      this.aiProvider,
      this.aiModel,
      this.processingTimeMs,
      this.creatorId,
      this.parentReviewId,
      this.chatSessionId,
      this.workspaceId,
      this.files,
      this.createdAt,
      new Date(),
      new Date(),
    );
  }

  public getTotalIssuesCount(): number {
    return this.files.reduce((total, file) => total + file.issues.length, 0);
  }

  public getCriticalIssuesCount(): number {
    return this.files.reduce(
      (total, file) => total + file.countIssuesBySeverity(Severity.CRITICAL),
      0,
    );
  }

  public static create(
    id: string,
    title: string,
    creatorId: string,
    files: ReviewFile[],
    options?: {
      description?: string;
      repository?: string;
      branch?: string;
      aiProvider?: string;
      parentReviewId?: string;
      workspaceId?: string;
    },
  ): Review {
    return new Review(
      id,
      title.trim(),
      options?.description || null,
      options?.repository || null,
      options?.branch || null,
      ReviewStatus.PENDING,
      null,
      null,
      null,
      null,
      options?.aiProvider || 'gemini',
      null,
      null,
      creatorId,
      options?.parentReviewId || null,
      null,
      options?.workspaceId || null,
      files,
      new Date(),
      new Date(),
      null,
    );
  }
}
