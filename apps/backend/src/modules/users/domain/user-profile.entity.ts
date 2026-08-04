import { UserRole } from '../../auth/domain/user-role.enum';
import { UserStatus } from '../../auth/domain/user-status.enum';

/**
 * UserProfile Entity
 * Purpose: Domain representation of complete user profile information.
 * Responsibilities: Provides safe view parameters without exposing password credentials.
 * Dependencies: UserRole, UserStatus.
 */
export class UserProfile {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string | null,
    public readonly username: string | null = null,
    public readonly avatarUrl: string | null = null,
    public readonly bio: string | null = null,
    public readonly company: string | null = null,
    public readonly location: string | null = null,
    public readonly website: string | null = null,
    public readonly timeZone: string | null = 'UTC',
    public readonly language: string | null = 'en',
    public readonly dateFormat: string | null = 'YYYY-MM-DD',
    public readonly timeFormat: string | null = '24h',
    public readonly role: UserRole = UserRole.USER,
    public readonly status: UserStatus = UserStatus.ACTIVE,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  public static fromDbUser(user: any): UserProfile {
    if (!user) return null as any;
    return new UserProfile(
      user.id,
      user.email,
      user.name || null,
      user.username || null,
      user.avatarUrl || null,
      user.bio || null,
      user.company || null,
      user.location || null,
      user.website || null,
      user.timeZone || 'UTC',
      user.language || 'en',
      user.dateFormat || 'YYYY-MM-DD',
      user.timeFormat || '24h',
      user.role as UserRole,
      user.status as UserStatus,
      user.createdAt || new Date(),
      user.updatedAt || new Date(),
    );
  }

  public static fromUser(user: any): UserProfile {
    return UserProfile.fromDbUser(user);
  }
}
