import { ChatMessage } from './chat-message.entity';

export class ChatSession {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly messages: ChatMessage[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    if (!title || title.trim().length === 0) {
      throw new Error('Chat session title cannot be empty');
    }
  }

  public addMessage(message: ChatMessage): ChatSession {
    return new ChatSession(
      this.id,
      this.userId,
      this.title,
      [...this.messages, message],
      this.createdAt,
      new Date(),
    );
  }

  public static create(id: string, userId: string, title: string): ChatSession {
    return new ChatSession(id, userId, title, [], new Date(), new Date());
  }
}
