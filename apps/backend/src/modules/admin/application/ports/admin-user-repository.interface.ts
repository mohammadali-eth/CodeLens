import { AdminRole } from '../../domain/admin-role.enum';
import { User } from '../../../auth/domain/user.entity';

export const ADMIN_USER_REPOSITORY = Symbol('ADMIN_USER_REPOSITORY');

export interface AdminUserQueryOptions {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedUsersResult {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IAdminUserRepository {
  findAll(options: AdminUserQueryOptions): Promise<PaginatedUsersResult>;
  findById(id: string): Promise<User | null>;
  updateStatus(id: string, status: string): Promise<User>;
  updateRole(id: string, role: AdminRole): Promise<User>;
  softDelete(id: string): Promise<void>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
  getUserReviewStats(userId: string): Promise<{ totalReviews: number; averageScore: number | null }>;
}
