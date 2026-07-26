/**
 * JobPriority Enum
 * Purpose: Defines numerical priority levels for BullMQ jobs.
 * Responsibilities: Lower numerical values indicate higher execution priority.
 * Dependencies: None.
 */
export enum JobPriority {
  CRITICAL = 1,
  HIGH = 2,
  NORMAL = 3,
  LOW = 4,
}
