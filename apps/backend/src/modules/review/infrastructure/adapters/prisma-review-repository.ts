import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../database/prisma.service';
import { IReviewRepository } from '../../application/ports/review-repository.interface';
import { Review } from '../../domain/review.entity';
import { ReviewFile, CodeIssue } from '../../domain/review-file.entity';
import { ReviewStatus } from '../../domain/review-status.enum';
import { Severity } from '../../domain/severity.enum';
import {
  ProgrammingLanguage,
  Review as DbReview,
  ReviewFile as DbReviewFile,
  Issue as DbIssue,
  ChatSession as DbChatSession,
} from '@prisma/client';

type FullDbReviewFile = DbReviewFile & {
  issues: DbIssue[];
};

type FullDbReview = DbReview & {
  files: FullDbReviewFile[];
  chatSessions?: DbChatSession[];
};

/**
 * PrismaReviewRepository Adapter
 * Purpose: Infrastructure adapter mapping Review domain aggregate to PostgreSQL via Prisma ORM.
 * Responsibilities: Performs CRUD queries, pagination, soft deletes, user favorite operations, and AI token/metrics persistence.
 * Dependencies: PrismaService, IReviewRepository interface, Review & ReviewFile domain entities.
 */
@Injectable()
export class PrismaReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(dbReview: FullDbReview): Review {
    const files = (dbReview.files || []).map((dbFile: FullDbReviewFile) => {
      const issues: CodeIssue[] = (dbFile.issues || []).map(
        (dbIssue: DbIssue) => ({
          id: dbIssue.id,
          line: dbIssue.line,
          severity: dbIssue.severity as Severity,
          category: dbIssue.category || 'GENERAL',
          message: dbIssue.message,
          suggestion: dbIssue.suggestion,
          createdAt: dbIssue.createdAt,
        }),
      );

      return new ReviewFile(
        dbFile.id,
        dbFile.reviewId,
        dbFile.filename,
        dbFile.content,
        dbFile.language,
        dbFile.fileSize || 0,
        dbFile.storagePath || null,
        dbFile.improvedCode || null,
        issues,
        dbFile.createdAt,
        dbFile.updatedAt,
      );
    });

    return new Review(
      dbReview.id,
      dbReview.title,
      dbReview.description || null,
      dbReview.repository || null,
      dbReview.branch || null,
      dbReview.status as ReviewStatus,
      dbReview.score || null,
      dbReview.summary || null,
      dbReview.timeComplexity || null,
      dbReview.spaceComplexity || null,
      dbReview.aiProvider || 'gemini',
      dbReview.aiModel || null,
      dbReview.processingTimeMs || null,
      dbReview.creatorId,
      dbReview.parentReviewId || null,
      dbReview.chatSessions?.[0]?.id || null,
      dbReview.workspaceId || null,
      files,
      dbReview.explanation || null,
      dbReview.confidenceScore || 0.95,
      dbReview.promptVersion || 'v1.0',
      dbReview.promptTokens || 0,
      dbReview.completionTokens || 0,
      dbReview.totalTokens || 0,
      dbReview.rawResponse || null,
      dbReview.createdAt,
      dbReview.updatedAt,
      dbReview.deletedAt || null,
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

    return dbReview && !dbReview.deletedAt ? this.mapToDomain(dbReview) : null;
  }

  async findByCreatorId(
    creatorId: string,
    skip = 0,
    take = 20,
  ): Promise<{ reviews: Review[]; total: number }> {
    const [dbReviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { creatorId, deletedAt: null },
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
      this.prisma.review.count({ where: { creatorId, deletedAt: null } }),
    ]);

    return {
      reviews: (dbReviews as FullDbReview[]).map((r) => this.mapToDomain(r)),
      total,
    };
  }

  async findAll(
    skip = 0,
    take = 20,
    filters?: {
      status?: string;
      search?: string;
      aiProvider?: string;
      language?: string;
    },
  ): Promise<{ reviews: Review[]; total: number }> {
    const where: any = { deletedAt: null };

    if (filters?.status && filters.status !== 'ALL') {
      where.status = filters.status;
    }

    if (filters?.aiProvider && filters.aiProvider !== 'ALL') {
      where.aiProvider = filters.aiProvider.toLowerCase();
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [dbReviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
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
      this.prisma.review.count({ where }),
    ]);

    return {
      reviews: (dbReviews as FullDbReview[]).map((r) => this.mapToDomain(r)),
      total,
    };
  }

  async save(review: Review): Promise<Review> {
    const dbReview = await this.prisma.review.create({
      data: {
        id: review.id,
        title: review.title,
        description: review.description,
        repository: review.repository,
        branch: review.branch,
        status: review.status,
        score: review.score,
        summary: review.summary,
        explanation: review.explanation,
        timeComplexity: review.timeComplexity,
        spaceComplexity: review.spaceComplexity,
        aiProvider: review.aiProvider,
        aiModel: review.aiModel,
        processingTimeMs: review.processingTimeMs,
        confidenceScore: review.confidenceScore,
        promptVersion: review.promptVersion,
        promptTokens: review.promptTokens,
        completionTokens: review.completionTokens,
        totalTokens: review.totalTokens,
        rawResponse: review.rawResponse,
        creatorId: review.creatorId,
        parentReviewId: review.parentReviewId,
        workspaceId: review.workspaceId,
        files: {
          create: review.files.map((file) => ({
            id: file.id,
            filename: file.filename,
            content: file.content,
            language: (file.language in ProgrammingLanguage
              ? file.language
              : 'TYPESCRIPT') as ProgrammingLanguage,
            fileSize: file.fileSize,
            storagePath: file.storagePath,
            improvedCode: file.improvedCode,
            issues: {
              create: file.issues.map((issue) => ({
                id: issue.id || randomUUID(),
                line: issue.line,
                severity: issue.severity,
                category: issue.category || 'GENERAL',
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
    // 1. Persist file issues and improved code updates
    for (const file of review.files) {
      if (file.improvedCode) {
        await this.prisma.reviewFile.update({
          where: { id: file.id },
          data: { improvedCode: file.improvedCode },
        });
      }

      if (file.issues && file.issues.length > 0) {
        // Clear existing issues for re-analyzed review file
        await this.prisma.issue.deleteMany({
          where: { reviewFileId: file.id },
        });

        // Bulk insert newly generated findings
        await this.prisma.issue.createMany({
          data: file.issues.map((issue) => ({
            id: issue.id || randomUUID(),
            reviewFileId: file.id,
            line: issue.line,
            severity: issue.severity,
            category: issue.category || 'GENERAL',
            message: issue.message,
            suggestion: issue.suggestion,
          })),
        });
      }
    }

    // 2. Update parent Review record
    const dbReview = await this.prisma.review.update({
      where: { id: review.id },
      data: {
        status: review.status,
        score: review.score,
        summary: review.summary,
        explanation: review.explanation,
        timeComplexity: review.timeComplexity,
        spaceComplexity: review.spaceComplexity,
        processingTimeMs: review.processingTimeMs,
        aiModel: review.aiModel,
        confidenceScore: review.confidenceScore,
        promptVersion: review.promptVersion,
        promptTokens: review.promptTokens,
        completionTokens: review.completionTokens,
        totalTokens: review.totalTokens,
        rawResponse: review.rawResponse,
        deletedAt: review.deletedAt,
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

  async delete(id: string): Promise<void> {
    await this.prisma.review.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: ReviewStatus.CANCELLED,
      },
    });
  }

  async favorite(userId: string, reviewId: string): Promise<void> {
    await this.prisma.favoriteReview.upsert({
      where: {
        userId_reviewId: { userId, reviewId },
      },
      create: {
        userId,
        reviewId,
      },
      update: {},
    });
  }

  async unfavorite(userId: string, reviewId: string): Promise<void> {
    await this.prisma.favoriteReview.deleteMany({
      where: { userId, reviewId },
    });
  }

  async isFavorited(userId: string, reviewId: string): Promise<boolean> {
    const count = await this.prisma.favoriteReview.count({
      where: { userId, reviewId },
    });
    return count > 0;
  }
}
