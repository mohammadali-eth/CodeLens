import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { IReviewRepository } from '../../application/ports/review-repository.interface';
import { Review } from '../../domain/review.entity';
import { CodeFile } from '../../domain/code-file.entity';
import { Issue } from '../../domain/issue.entity';
import { ReviewStatus } from '../../domain/review-status.enum';
import { Severity } from '../../domain/severity.enum';

@Injectable()
export class PrismaReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(dbReview: any): Review {
    const files = (dbReview.files || []).map((dbFile: any) => {
      const issues = (dbFile.issues || []).map(
        (dbIssue: any) =>
          new Issue(
            dbIssue.id,
            dbIssue.fileId,
            dbIssue.line,
            dbIssue.severity as Severity,
            dbIssue.type,
            dbIssue.message,
            dbIssue.suggestion,
          ),
      );
      return new CodeFile(
        dbFile.id,
        dbFile.reviewId,
        dbFile.filename,
        dbFile.content,
        dbFile.language,
        issues,
      );
    });

    return new Review(
      dbReview.id,
      dbReview.title,
      dbReview.repository,
      dbReview.branch,
      dbReview.status as ReviewStatus,
      dbReview.score,
      dbReview.creatorId,
      files,
      dbReview.createdAt,
      dbReview.updatedAt,
    );
  }

  async findById(id: string): Promise<Review | null> {
    const dbReview = await this.prisma.review.findUnique({
      where: { id },
      include: {
        files: {
          include: {
            issues: true,
          },
        },
      },
    });
    return dbReview ? this.mapToDomain(dbReview) : null;
  }

  async findByCreatorId(
    creatorId: string,
    skip: number,
    take: number,
  ): Promise<{ reviews: Review[]; total: number }> {
    const [dbReviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { creatorId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          files: {
            include: {
              issues: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where: { creatorId } }),
    ]);

    return {
      reviews: dbReviews.map((r) => this.mapToDomain(r)),
      total,
    };
  }

  async save(review: Review): Promise<Review> {
    const dbReview = await this.prisma.review.create({
      data: {
        id: review.id,
        title: review.title,
        repository: review.repository,
        branch: review.branch,
        status: review.status,
        score: review.score,
        creatorId: review.creatorId,
        files: {
          create: review.files.map((file) => ({
            id: file.id,
            filename: file.filename,
            content: file.content,
            language: file.language,
            issues: {
              create: file.issues.map((issue) => ({
                id: issue.id,
                line: issue.line,
                severity: issue.severity,
                type: issue.type,
                message: issue.message,
                suggestion: issue.suggestion,
              })),
            },
          })),
        },
      },
      include: {
        files: {
          include: {
            issues: true,
          },
        },
      },
    });

    return this.mapToDomain(dbReview);
  }

  async update(review: Review): Promise<Review> {
    const dbReview = await this.prisma.review.update({
      where: { id: review.id },
      data: {
        status: review.status,
        score: review.score,
      },
      include: {
        files: {
          include: {
            issues: true,
          },
        },
      },
    });
    return this.mapToDomain(dbReview);
  }
}
