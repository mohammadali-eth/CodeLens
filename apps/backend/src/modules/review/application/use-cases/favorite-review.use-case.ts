import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IReviewRepository } from '../ports/review-repository.interface';

@Injectable()
export class FavoriteReviewUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async favorite(reviewId: string, userId: string): Promise<void> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException(`Review with ID "${reviewId}" was not found`);
    }

    await this.reviewRepository.favorite(userId, reviewId);
  }

  async unfavorite(reviewId: string, userId: string): Promise<void> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException(`Review with ID "${reviewId}" was not found`);
    }

    await this.reviewRepository.unfavorite(userId, reviewId);
  }
}
