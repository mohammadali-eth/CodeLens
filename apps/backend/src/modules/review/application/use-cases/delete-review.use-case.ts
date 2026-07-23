import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IReviewRepository } from '../ports/review-repository.interface';

@Injectable()
export class DeleteReviewUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(reviewId: string, userId: string): Promise<void> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException(`Review with ID "${reviewId}" was not found`);
    }

    if (review.creatorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this review',
      );
    }

    await this.reviewRepository.delete(reviewId);
  }
}
