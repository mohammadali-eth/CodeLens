import { MessageRole } from './message-role.enum';
import { ChatAttachment } from './chat-attachment.value-object';

/**
 * ChatMessage Entity
 * Purpose: Represents an individual message (User prompt or AI Assistant response) within a session.
 * Responsibilities: Tracks text content, message role, token usage, performance timing, and attachments.
 */
export class ChatMessage {
  constructor(
    public readonly id: string,
    public readonly sessionId: string,
    public readonly role: MessageRole,
    public readonly content: string,
    public readonly promptTokens: number = 0,
    public readonly completionTokens: number = 0,
    public readonly totalTokens: number = 0,
    public readonly processingTimeMs: number | null = null,
    public readonly modelUsed: string | null = null,
    public readonly attachments: ChatAttachment[] = [],
    public readonly createdAt: Date = new Date(),
    public readonly deletedAt: Date | null = null,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.content || this.content.trim().length === 0) {
      throw new Error('ChatMessage content cannot be empty');
    }
  }

  public softDelete(): ChatMessage {
    return new ChatMessage(
      this.id,
      this.sessionId,
      this.role,
      this.content,
      this.promptTokens,
      this.completionTokens,
      this.totalTokens,
      this.processingTimeMs,
      this.modelUsed,
      this.attachments,
      this.createdAt,
      new Date(),
    );
  }

  public static create(
    id: string,
    sessionId: string,
    role: MessageRole,
    content: string,
    metrics?: {
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
      processingTimeMs?: number;
      modelUsed?: string;
    },
    attachments: ChatAttachment[] = [],
  ): ChatMessage {
    return new ChatMessage(
      id,
      sessionId,
      role,
      content.trim(),
      metrics?.promptTokens || 0,
      metrics?.completionTokens || 0,
      metrics?.totalTokens ||
        (metrics?.promptTokens || 0) + (metrics?.completionTokens || 0),
      metrics?.processingTimeMs || null,
      metrics?.modelUsed || null,
      attachments,
      new Date(),
      null,
    );
  }
}
