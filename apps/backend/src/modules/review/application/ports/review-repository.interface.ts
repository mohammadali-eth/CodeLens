import { Review } from '../../domain/review.entity';

export interface IReviewRepository {
  findById(id: string): Promise<Review | null>;
  findByCreatorId(creatorId: string, skip: number, take: number): Promise<{ reviews: Review[]; total: number }>;
  save(review: Review): Promise<Review>;
  update(review: Review): Promise<Review>;
}

export const IReviewRepository = Symbol('IReviewRepository');
