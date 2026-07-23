import { ChatSession } from '../../domain/chat-session.entity';
import { ChatMessage } from '../../domain/chat-message.entity';

export interface IChatRepository {
  findSessionById(id: string): Promise<ChatSession | null>;
  findSessionsByUserId(userId: string): Promise<ChatSession[]>;
  saveSession(session: ChatSession): Promise<ChatSession>;
  saveMessage(message: ChatMessage): Promise<ChatMessage>;
}

export const IChatRepository = Symbol('IChatRepository');
