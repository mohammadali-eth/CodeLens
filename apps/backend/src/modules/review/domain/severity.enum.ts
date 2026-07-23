/**
 * Severity Enum
 * Purpose: Categorizes detected code issues by risk and impact level.
 * Responsibilities: Provides issue severity ratings for quality scoring algorithms.
 * Dependencies: None.
 * Future Extensibility: Used by quality gates to enforce CI/CD deployment blocks.
 */
export enum Severity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}
