import { ReviewStatus } from './review-status.enum';
import { CodeFile } from './code-file.entity';
import { Severity } from './severity.enum';

export class Review {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly repository: string,
    public readonly branch: string,
    public readonly status: ReviewStatus,
    public readonly score: number | null,
    public readonly creatorId: string,
    public readonly files: CodeFile[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    if (!title || title.trim().length === 0) {
      throw new Error('Review title cannot be empty');
    }
  }

  public completeReview(filesWithIssues: CodeFile[]): Review {
    const calculatedScore = this.calculateHealthScore(filesWithIssues);
    return new Review(
      this.id,
      this.title,
      this.repository,
      this.branch,
      ReviewStatus.COMPLETED,
      calculatedScore,
      this.creatorId,
      filesWithIssues,
      this.createdAt,
      new Date(),
    );
  }

  public markAsFailed(): Review {
    return new Review(
      this.id,
      this.title,
      this.repository,
      this.branch,
      ReviewStatus.FAILED,
      0,
      this.creatorId,
      this.files,
      this.createdAt,
      new Date(),
    );
  }

  private calculateHealthScore(files: CodeFile[]): number {
    let baseScore = 100;
    for (const file of files) {
      for (const issue of file.issues) {
        switch (issue.severity) {
          case Severity.CRITICAL:
            baseScore -= 25;
            break;
          case Severity.HIGH:
            baseScore -= 15;
            break;
          case Severity.MEDIUM:
            baseScore -= 8;
            break;
          case Severity.LOW:
            baseScore -= 3;
            break;
          case Severity.INFO:
            baseScore -= 1;
            break;
        }
      }
    }
    return Math.max(0, baseScore);
  }

  public static create(
    id: string,
    title: string,
    repository: string,
    branch: string,
    creatorId: string,
    files: CodeFile[] = [],
  ): Review {
    return new Review(
      id,
      title,
      repository,
      branch,
      ReviewStatus.PENDING,
      null,
      creatorId,
      files,
      new Date(),
      new Date(),
    );
  }
}
