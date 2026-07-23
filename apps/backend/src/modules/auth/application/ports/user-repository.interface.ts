import { User } from '../../domain/user.entity';

/**
 * IUserRepository Port
 * Purpose: Decouples domain logic from specific database ORMs or providers.
 * Responsibilities: Defines standard CRUD and query contracts for User aggregates.
 * Dependencies: User domain entity.
 */
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(options?: { skip?: number; take?: number }): Promise<{ users: User[]; total: number }>;
  save(user: User): Promise<User>;
}

export const IUserRepository = Symbol('IUserRepository');
