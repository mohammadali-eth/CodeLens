import { MessageRole } from './message-role.enum';

export class ChatMessage {
  constructor(
    public readonly id: string,
    public readonly sessionId: string,
    public readonly role: MessageRole,
    public readonly content: string,
    public readonly createdAt: Date,
  ) {
    if (!content || content.trim().length === 0) {
      throw new Error('Chat message content cannot be empty');
    }
  }

  public static create(
    id: string,
    sessionId: string,
    role: MessageRole,
    content: string,
  ): ChatMessage {
    return new ChatMessage(id, sessionId, role, content, new Date());
  }
}
