/**
 * QueueName Enum
 * Purpose: Defines dedicated BullMQ background processing queue identifiers.
 * Responsibilities: Provides centralized constants for task producers and worker consumers.
 * Dependencies: None.
 */
export enum QueueName {
  AI_ANALYSIS = 'ai-analysis',
  REPORT_GENERATION = 'report-generation',
  EMAIL_NOTIFICATIONS = 'email-notifications',
  AUDIT_LOGGING = 'audit-logging',
  CACHE_REFRESH = 'cache-refresh',
  CLEANUP_TASKS = 'cleanup-tasks',
}
