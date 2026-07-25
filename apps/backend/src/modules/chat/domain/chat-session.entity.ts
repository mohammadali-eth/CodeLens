import { ChatMessage } from './chat-message.entity';

/**
 * ChatSession Aggregate Root
 * Purpose: Represents a conversation session between a user and the AI Assistant.
 * Responsibilities: Enforces title updates, pinning, message history bounds, token aggregation, and soft deletion.
 */
export class ChatSession {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly reviewId: string | null = null,
    public readonly isPinned: boolean = false,
    public readonly aiProvider: string = 'gemini',
    public readonly aiModel: string | null = null,
    public readonly totalTokens: number = 0,
    public readonly messages: ChatMessage[] = [],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly deletedAt: Date | null = null,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.userId || this.userId.trim().length === 0) {
      throw new Error('ChatSession userId cannot be empty');
    }
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('ChatSession title cannot be empty');
    }
  }

  public rename(newTitle: string): ChatSession {
    return new ChatSession(
      this.id,
      this.userId,
      newTitle.trim(),
      this.reviewId,
      this.isPinned,
      this.aiProvider,
      this.aiModel,
      this.totalTokens,
      this.messages,
      this.createdAt,
      new Date(),
      this.deletedAt,
    );
  }

  public togglePin(isPinned?: boolean): ChatSession {
    return new ChatSession(
      this.id,
      this.userId,
      this.title,
      this.reviewId,
      isPinned !== undefined ? isPinned : !this.isPinned,
      this.aiProvider,
      this.aiModel,
      this.totalTokens,
      this.messages,
      this.createdAt,
      new Date(),
      this.deletedAt,
    );
  }

  public addMessage(message: ChatMessage): ChatSession {
    const updatedMessages = [...this.messages, message];
    const newTotalTokens = this.totalTokens + message.totalTokens;
    return new ChatSession(
      this.id,
      this.userId,
      this.title,
      this.reviewId,
      this.isPinned,
      this.aiProvider,
      message.modelUsed || this.aiModel,
      newTotalTokens,
      updatedMessages,
      this.createdAt,
      new Date(),
      this.deletedAt,
    );
  }

  public softDelete(): ChatSession {
    return new ChatSession(
      this.id,
      this.userId,
      this.title,
      this.reviewId,
      this.isPinned,
      this.aiProvider,
      this.aiModel,
      this.totalTokens,
      this.messages,
      this.createdAt,
      new Date(),
      new Date(),
    );
  }

  public static create(
    id: string,
    userId: string,
    title: string,
    reviewId?: string | null,
    aiProvider = 'gemini',
    aiModel?: string | null,
  ): ChatSession {
    return new ChatSession(
      id,
      userId,
      title.trim(),
      reviewId || null,
      false,
      aiProvider,
      aiModel || null,
      0,
      [],
      new Date(),
      new Date(),
      null,
    );
  }
}
