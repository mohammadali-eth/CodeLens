import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IReviewRepository } from '../ports/review-repository.interface';
import { Review } from '../../domain/review.entity';
import { AnalyzeCodeReviewUseCase } from '../../../ai/application/use-cases/analyze-code-review.use-case';

@Injectable()
export class RerunReviewUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
    private readonly analyzeCodeReviewUseCase: AnalyzeCodeReviewUseCase,
  ) {}

  async execute(
    reviewId: string,
    userId: string,
    providerChoice?: string,
  ): Promise<Review> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException(`Review with ID "${reviewId}" was not found`);
    }

    if (review.creatorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to re-run this review',
      );
    }

    // Mark review as PROCESSING before re-analysis
    const processingReview = review.markProcessing();
    await this.reviewRepository.update(processingReview);

    // Trigger AI analysis pipeline
    return await this.analyzeCodeReviewUseCase.execute(
      reviewId,
      providerChoice || review.aiProvider,
    );
  }
}
