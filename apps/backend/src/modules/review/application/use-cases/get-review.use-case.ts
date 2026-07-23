import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IReviewRepository } from '../ports/review-repository.interface';
import { Review } from '../../domain/review.entity';

@Injectable()
export class GetReviewUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(
    reviewId: string,
    userId: string,
  ): Promise<{ review: Review; isFavorited: boolean }> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException(`Review with ID "${reviewId}" was not found`);
    }

    if (review.creatorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this review',
      );
    }

    const isFavorited = await this.reviewRepository.isFavorited(
      userId,
      reviewId,
    );

    return { review, isFavorited };
  }
}
