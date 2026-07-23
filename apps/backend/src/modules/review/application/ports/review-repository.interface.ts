import { Review } from '../../domain/review.entity';

export interface IReviewRepository {
  findById(id: string): Promise<Review | null>;
  findByCreatorId(
    creatorId: string,
    skip?: number,
    take?: number,
  ): Promise<{ reviews: Review[]; total: number }>;
  save(review: Review): Promise<Review>;
  update(review: Review): Promise<Review>;
  delete(id: string): Promise<void>;
  favorite(userId: string, reviewId: string): Promise<void>;
  unfavorite(userId: string, reviewId: string): Promise<void>;
  isFavorited(userId: string, reviewId: string): Promise<boolean>;
}

export const IReviewRepository = Symbol('IReviewRepository');
