/**
 * RefreshToken Entity
 * Purpose: Models refresh token sessions and rotation families.
 * Responsibilities: Encapsulates token lifecycle state, revocation, and expiration logic.
 * Dependencies: None.
 */
export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly userId: string,
    public readonly family: string,
    public readonly isRevoked: boolean,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  public isValid(): boolean {
    return !this.isRevoked && !this.isExpired();
  }

  public revoke(): RefreshToken {
    return new RefreshToken(
      this.id,
      this.token,
      this.userId,
      this.family,
      true,
      this.expiresAt,
      this.createdAt,
      new Date(),
    );
  }

  public static create(
    id: string,
    token: string,
    userId: string,
    family: string,
    expiresAt: Date,
  ): RefreshToken {
    return new RefreshToken(
      id,
      token,
      userId,
      family,
      false,
      expiresAt,
      new Date(),
      new Date(),
    );
  }
}
