import { Inject, Injectable } from '@nestjs/common';
import { IReviewRepository } from '../ports/review-repository.interface';
import { Review } from '../../domain/review.entity';

export interface ListReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class ListReviewsUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(creatorId: string, page = 1, limit = 10): Promise<ListReviewsResponse> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const { reviews, total } = await this.reviewRepository.findByCreatorId(creatorId, skip, safeLimit);

    return {
      reviews,
      total,
      page: safePage,
      limit: safeLimit,
    };
  }
}
