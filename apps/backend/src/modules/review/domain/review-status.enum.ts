/**
 * ReviewStatus Enum
 * Purpose: Defines state transitions for code review processing pipeline.
 * Responsibilities: Encapsulates review state invariants.
 * Dependencies: None.
 * Future Extensibility: Extensible for additional queue states or human review approvals.
 */
export enum ReviewStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}
