import { Inject, Injectable } from '@nestjs/common';
import { IReviewRepository } from '../ports/review-repository.interface';
import { Review } from '../../domain/review.entity';

@Injectable()
export class ListReviewsUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(
    userId: string,
    skip = 0,
    take = 20,
  ): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { reviews, total } = await this.reviewRepository.findByCreatorId(
      userId,
      skip,
      take,
    );
    const totalPages = Math.ceil(total / take) || 1;
    const page = Math.floor(skip / take) + 1;

    return {
      reviews,
      total,
      page,
      totalPages,
    };
  }
}
