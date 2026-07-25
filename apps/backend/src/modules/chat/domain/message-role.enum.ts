/**
 * MessageRole Enum
 * Purpose: Defines chat message sender persona roles.
 * Responsibilities: Differentiates system prompt instructions, user questions, and AI assistant responses.
 */
export enum MessageRole {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
}
