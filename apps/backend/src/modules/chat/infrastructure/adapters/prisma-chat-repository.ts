import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { IChatRepository } from '../../application/ports/chat-repository.interface';
import { ChatSession } from '../../domain/chat-session.entity';
import { ChatMessage } from '../../domain/chat-message.entity';
import { MessageRole } from '../../domain/message-role.enum';
import { ChatAttachment } from '../../domain/chat-attachment.value-object';
import {
  ChatSession as DbChatSession,
  ChatMessage as DbChatMessage,
  ChatAttachment as DbChatAttachment,
} from '@prisma/client';

type FullDbChatMessage = DbChatMessage & {
  attachments?: DbChatAttachment[];
};

type FullDbChatSession = DbChatSession & {
  messages: FullDbChatMessage[];
};

@Injectable()
export class PrismaChatRepository implements IChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapSessionToDomain(dbSession: FullDbChatSession): ChatSession {
    const messages = (dbSession.messages || []).map((m: FullDbChatMessage) => {
      const attachments = (m.attachments || []).map(
        (att: DbChatAttachment) =>
          new ChatAttachment(
            att.id,
            att.messageId,
            att.fileId,
            att.filename,
            att.lineStart,
            att.lineEnd,
            att.snippet,
            att.createdAt,
          ),
      );

      return new ChatMessage(
        m.id,
        m.sessionId,
        m.role as MessageRole,
        m.content,
        m.promptTokens || 0,
        m.completionTokens || 0,
        m.totalTokens || 0,
        m.processingTimeMs || null,
        m.modelUsed || null,
        attachments,
        m.createdAt,
        m.deletedAt || null,
      );
    });

    return new ChatSession(
      dbSession.id,
      dbSession.userId,
      dbSession.title,
      dbSession.reviewId || null,
      dbSession.isPinned || false,
      dbSession.aiProvider || 'gemini',
      dbSession.aiModel || null,
      dbSession.totalTokens || 0,
      messages,
      dbSession.createdAt,
      dbSession.updatedAt,
      dbSession.deletedAt || null,
    );
  }

  async findSessionById(id: string): Promise<ChatSession | null> {
    const dbSession = (await this.prisma.chatSession.findFirst({
      where: { id, deletedAt: null },
      include: {
        messages: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
          include: { attachments: true },
        },
      },
    })) as FullDbChatSession | null;

    return dbSession ? this.mapSessionToDomain(dbSession) : null;
  }

  async findSessionsByUserId(userId: string): Promise<ChatSession[]> {
    const dbSessions = (await this.prisma.chatSession.findMany({
      where: { userId, deletedAt: null },
      orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
      include: {
        messages: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
          include: { attachments: true },
        },
      },
    })) as FullDbChatSession[];

    return dbSessions.map((s) => this.mapSessionToDomain(s));
  }

  async findSessionsByReviewId(reviewId: string): Promise<ChatSession[]> {
    const dbSessions = (await this.prisma.chatSession.findMany({
      where: { reviewId, deletedAt: null },
      orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
      include: {
        messages: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
          include: { attachments: true },
        },
      },
    })) as FullDbChatSession[];

    return dbSessions.map((s) => this.mapSessionToDomain(s));
  }

  async saveSession(session: ChatSession): Promise<ChatSession> {
    const dbSession = (await this.prisma.chatSession.upsert({
      where: { id: session.id },
      create: {
        id: session.id,
        userId: session.userId,
        title: session.title,
        reviewId: session.reviewId,
        isPinned: session.isPinned,
        aiProvider: session.aiProvider,
        aiModel: session.aiModel,
        totalTokens: session.totalTokens,
        deletedAt: session.deletedAt,
      },
      update: {
        title: session.title,
        isPinned: session.isPinned,
        aiProvider: session.aiProvider,
        aiModel: session.aiModel,
        totalTokens: session.totalTokens,
        deletedAt: session.deletedAt,
      },
      include: {
        messages: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
          include: { attachments: true },
        },
      },
    })) as FullDbChatSession;

    return this.mapSessionToDomain(dbSession);
  }

  async saveMessage(message: ChatMessage): Promise<ChatMessage> {
    const dbMessage = (await this.prisma.chatMessage.create({
      data: {
        id: message.id,
        sessionId: message.sessionId,
        role: message.role,
        content: message.content,
        promptTokens: message.promptTokens,
        completionTokens: message.completionTokens,
        totalTokens: message.totalTokens,
        processingTimeMs: message.processingTimeMs,
        modelUsed: message.modelUsed,
        deletedAt: message.deletedAt,
      },
      include: {
        attachments: true,
      },
    })) as FullDbChatMessage;

    if (message.attachments && message.attachments.length > 0) {
      await this.prisma.chatAttachment.createMany({
        data: message.attachments.map((att) => ({
          id: att.id,
          messageId: dbMessage.id,
          fileId: att.fileId,
          filename: att.filename,
          lineStart: att.lineStart,
          lineEnd: att.lineEnd,
          snippet: att.snippet,
        })),
      });
    }

    return new ChatMessage(
      dbMessage.id,
      dbMessage.sessionId,
      dbMessage.role as MessageRole,
      dbMessage.content,
      dbMessage.promptTokens || 0,
      dbMessage.completionTokens || 0,
      dbMessage.totalTokens || 0,
      dbMessage.processingTimeMs || null,
      dbMessage.modelUsed || null,
      message.attachments,
      dbMessage.createdAt,
      dbMessage.deletedAt || null,
    );
  }

  async deleteSession(id: string): Promise<void> {
    await this.prisma.chatSession.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
