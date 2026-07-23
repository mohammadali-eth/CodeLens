import { UserRole } from './user-role.enum';
import { UserStatus } from './user-status.enum';

/**
 * User Entity (Aggregate Root)
 * Purpose: Represents a system user and enforces core domain invariants.
 * Responsibilities: Manages user attributes, authentication permissions, password hashing references, and lifecycle states.
 * Dependencies: UserRole, UserStatus.
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly name: string | null,
    public readonly role: UserRole,
    public readonly status: UserStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null = null,
  ) {
    this.validateEmail(email);
  }

  private validateEmail(email: string): void {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address format');
    }
  }

  public isActive(): boolean {
    return this.status === UserStatus.ACTIVE && !this.deletedAt;
  }

  public isDeleted(): boolean {
    return this.status === UserStatus.DELETED || this.deletedAt !== null;
  }

  public canAuthenticate(): boolean {
    return (
      (this.status === UserStatus.ACTIVE || this.status === UserStatus.PENDING_VERIFICATION) &&
      !this.deletedAt
    );
  }

  public softDelete(): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      this.name,
      this.role,
      UserStatus.DELETED,
      this.createdAt,
      new Date(),
      new Date(),
    );
  }

  public updateStatus(newStatus: UserStatus): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      this.name,
      this.role,
      newStatus,
      this.createdAt,
      new Date(),
      newStatus === UserStatus.DELETED ? new Date() : this.deletedAt,
    );
  }

  public updateProfile(name?: string): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      name !== undefined ? name : this.name,
      this.role,
      this.status,
      this.createdAt,
      new Date(),
      this.deletedAt,
    );
  }

  public updatePassword(newPasswordHash: string): User {
    return new User(
      this.id,
      this.email,
      newPasswordHash,
      this.name,
      this.role,
      this.status,
      this.createdAt,
      new Date(),
      this.deletedAt,
    );
  }

  public static create(
    id: string,
    email: string,
    passwordHash: string,
    name?: string | null,
    role: UserRole = UserRole.USER,
  ): User {
    return new User(
      id,
      email.toLowerCase().trim(),
      passwordHash,
      name || null,
      role,
      UserStatus.ACTIVE, // Defaulting active for production workflow
      new Date(),
      new Date(),
      null,
    );
  }
}
