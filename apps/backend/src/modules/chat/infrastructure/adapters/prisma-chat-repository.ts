import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { IChatRepository } from '../../application/ports/chat-repository.interface';
import { ChatSession } from '../../domain/chat-session.entity';
import { ChatMessage } from '../../domain/chat-message.entity';
import { MessageRole } from '../../domain/message-role.enum';
import {
  ChatSession as DbChatSession,
  ChatMessage as DbChatMessage,
} from '@prisma/client';

type FullDbChatSession = DbChatSession & {
  messages: DbChatMessage[];
};

@Injectable()
export class PrismaChatRepository implements IChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapSessionToDomain(dbSession: FullDbChatSession): ChatSession {
    const messages = (dbSession.messages || []).map(
      (m: DbChatMessage) =>
        new ChatMessage(
          m.id,
          m.sessionId,
          m.role as MessageRole,
          m.content,
          m.createdAt,
        ),
    );

    return new ChatSession(
      dbSession.id,
      dbSession.userId,
      dbSession.title,
      messages,
      dbSession.createdAt,
      dbSession.updatedAt,
    );
  }

  async findSessionById(id: string): Promise<ChatSession | null> {
    const dbSession = await this.prisma.chatSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return dbSession ? this.mapSessionToDomain(dbSession) : null;
  }

  async findSessionsByUserId(userId: string): Promise<ChatSession[]> {
    const dbSessions = (await this.prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })) as FullDbChatSession[];

    return dbSessions.map((s) => this.mapSessionToDomain(s));
  }

  async saveSession(session: ChatSession): Promise<ChatSession> {
    const dbSession = await this.prisma.chatSession.create({
      data: {
        id: session.id,
        userId: session.userId,
        title: session.title,
      },
      include: {
        messages: true,
      },
    });

    return this.mapSessionToDomain(dbSession);
  }

  async saveMessage(message: ChatMessage): Promise<ChatMessage> {
    const dbMessage = await this.prisma.chatMessage.create({
      data: {
        id: message.id,
        sessionId: message.sessionId,
        role: message.role,
        content: message.content,
      },
    });

    return new ChatMessage(
      dbMessage.id,
      dbMessage.sessionId,
      dbMessage.role as MessageRole,
      dbMessage.content,
      dbMessage.createdAt,
    );
  }
}
