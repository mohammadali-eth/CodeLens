export class SharedReportEntity {
  constructor(
    public readonly id: string,
    public readonly reportId: string,
    public readonly token: string,
    public readonly accessCount: number,
    public readonly isRevoked: boolean,
    public readonly expiresAt: Date,
    public readonly createdById: string,
    public readonly createdAt: Date = new Date(),
    public readonly lastAccessedAt?: Date | null,
  ) {}

  public isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  public isValid(): boolean {
    return !this.isRevoked && !this.isExpired();
  }
}
