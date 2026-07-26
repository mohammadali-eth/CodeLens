/**
 * AdminAuditLogEntity Domain Entity
 * Purpose: Represents an immutable system audit trail record.
 * Responsibilities: Captures administrative and security action logs with client metadata.
 * Dependencies: None.
 */
export class AdminAuditLogEntity {
  constructor(
    public readonly id: string,
    public readonly action: string,
    public readonly userId?: string | null,
    public readonly userEmail?: string | null,
    public readonly resource?: string | null,
    public readonly ipAddress?: string | null,
    public readonly userAgent?: string | null,
    public readonly metadata?: Record<string, any> | null,
    public readonly createdAt: Date = new Date(),
  ) {}
}
