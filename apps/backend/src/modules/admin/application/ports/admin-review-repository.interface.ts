import { Review } from '../../../review/domain/review.entity';

export const ADMIN_REVIEW_REPOSITORY = Symbol('ADMIN_REVIEW_REPOSITORY');

export interface AdminReviewQueryOptions {
  search?: string;
  status?: string;
  creatorId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAdminReviewsResult {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IAdminReviewRepository {
  findAll(
    options: AdminReviewQueryOptions,
  ): Promise<PaginatedAdminReviewsResult>;
  findById(id: string): Promise<Review | null>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<Review>;
}
