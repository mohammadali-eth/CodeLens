import { ChatSession } from '../../domain/chat-session.entity';
import { ChatMessage } from '../../domain/chat-message.entity';

export interface IChatRepository {
  findSessionById(id: string): Promise<ChatSession | null>;
  findSessionsByUserId(userId: string): Promise<ChatSession[]>;
  findSessionsByReviewId(reviewId: string): Promise<ChatSession[]>;
  saveSession(session: ChatSession): Promise<ChatSession>;
  saveMessage(message: ChatMessage): Promise<ChatMessage>;
  deleteSession(id: string): Promise<void>;
}

export const IChatRepository = Symbol('IChatRepository');
