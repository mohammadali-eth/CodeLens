/**
 * UserStatus Enum
 * Purpose: Represents account lifecycle and access states.
 * Responsibilities: Enforces state transitions and login access guards.
 * Dependencies: None.
 */
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}
