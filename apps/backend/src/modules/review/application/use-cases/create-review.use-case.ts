import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IReviewRepository } from '../ports/review-repository.interface';
import { Review } from '../../domain/review.entity';
import { ReviewFile } from '../../domain/review-file.entity';
import { CreateReviewDto } from '../../infrastructure/controllers/dtos/create-review.dto';

/**
 * CreateReviewUseCase
 * Application use case for creating and persisting new code review requests.
 */
@Injectable()
export class CreateReviewUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(dto: CreateReviewDto, creatorId: string): Promise<Review> {
    if (!dto.files || dto.files.length === 0) {
      throw new BadRequestException(
        'At least one code file must be submitted for review',
      );
    }

    const reviewId = randomUUID();

    // Map DTO files to ReviewFile domain entities
    const reviewFiles: ReviewFile[] = dto.files.map((f) => {
      const fileId = randomUUID();
      const detectedLanguage = this.inferLanguageFromFilename(
        f.filename,
        f.language,
      );

      return ReviewFile.create(
        fileId,
        reviewId,
        f.filename,
        f.content,
        detectedLanguage,
      );
    });

    // Construct Review aggregate root in PENDING status
    const review = Review.create(reviewId, dto.title, creatorId, reviewFiles, {
      description: dto.description,
      repository: dto.repository,
      branch: dto.branch || 'main',
      aiProvider: dto.aiProvider || 'gemini',
      aiModel: dto.aiModel,
      workspaceId: dto.workspaceId,
    });

    // Persist review aggregate in database
    return await this.reviewRepository.save(review);
  }

  private inferLanguageFromFilename(
    filename: string,
    explicitLanguage?: string,
  ): string {
    if (explicitLanguage && explicitLanguage.trim().length > 0) {
      return explicitLanguage.toUpperCase();
    }

    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'java':
        return 'JAVA';
      case 'js':
      case 'jsx':
        return 'JAVASCRIPT';
      case 'ts':
      case 'tsx':
        return 'TYPESCRIPT';
      case 'py':
        return 'PYTHON';
      case 'c':
      case 'h':
        return 'C';
      case 'cpp':
      case 'cc':
      case 'cxx':
      case 'hpp':
        return 'CPP';
      case 'cs':
        return 'CSHARP';
      case 'go':
        return 'GO';
      case 'rs':
        return 'RUST';
      case 'php':
        return 'PHP';
      default:
        return 'TYPESCRIPT';
    }
  }
}
