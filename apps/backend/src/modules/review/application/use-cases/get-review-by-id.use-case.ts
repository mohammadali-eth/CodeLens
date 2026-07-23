import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IReviewRepository } from '../ports/review-repository.interface';
import { Review } from '../../domain/review.entity';

@Injectable()
export class GetReviewByIdUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(id: string): Promise<Review> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException(`Code review with ID "${id}" was not found`);
    }
    return review;
  }
}
