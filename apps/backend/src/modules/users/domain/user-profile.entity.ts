import { UserRole } from '../../auth/domain/user-role.enum';
import { UserStatus } from '../../auth/domain/user-status.enum';
import { User } from '../../auth/domain/user.entity';

/**
 * UserProfile Entity
 * Purpose: Domain representation of user profile information.
 * Responsibilities: Provides safe view parameters without exposing security credentials.
 * Dependencies: UserRole, UserStatus, User.
 */
export class UserProfile {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string | null,
    public readonly role: UserRole,
    public readonly status: UserStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static fromUser(user: User): UserProfile {
    return new UserProfile(
      user.id,
      user.email,
      user.name,
      user.role,
      user.status,
      user.createdAt,
      user.updatedAt,
    );
  }
}
