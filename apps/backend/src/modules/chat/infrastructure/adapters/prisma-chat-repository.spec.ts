/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/// <reference types="jest" />

import { PrismaChatRepository } from './prisma-chat-repository';
import { PrismaService } from '../../../database/prisma.service';
import { ChatMessage } from '../../domain/chat-message.entity';
import { MessageRole } from '../../domain/message-role.enum';

describe('PrismaChatRepository', () => {
  let repository: PrismaChatRepository;
  let prismaMock: jest.Mocked<PrismaService>;

  const mockDbSession = {
    id: 'session-1',
    userId: 'user-1',
    reviewId: 'review-1',
    title: 'Test Chat',
    isPinned: false,
    aiProvider: 'gemini',
    aiModel: 'gemini-1.5-pro',
    totalTokens: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    messages: [
      {
        id: 'msg-1',
        sessionId: 'session-1',
        role: MessageRole.USER,
        content: 'Hello AI',
        promptTokens: 10,
        completionTokens: 0,
        totalTokens: 10,
        processingTimeMs: null,
        modelUsed: null,
        createdAt: new Date(),
        deletedAt: null,
        attachments: [],
      },
    ],
  };

  beforeEach(() => {
    prismaMock = {
      chatSession: {
        findFirst: jest.fn().mockResolvedValue(mockDbSession),
        findMany: jest.fn().mockResolvedValue([mockDbSession]),
        upsert: jest.fn().mockResolvedValue(mockDbSession),
        update: jest.fn().mockResolvedValue(mockDbSession),
      },
      chatMessage: {
        create: jest.fn().mockResolvedValue(mockDbSession.messages[0]),
      },
      chatAttachment: {
        createMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
    } as any;

    repository = new PrismaChatRepository(prismaMock);
  });

  it('should find session by ID', async () => {
    const session = await repository.findSessionById('session-1');
    expect(session).toBeDefined();
    expect(session?.id).toBe('session-1');
    expect(session?.title).toBe('Test Chat');
    expect(session?.messages).toHaveLength(1);
  });

  it('should find sessions by user ID', async () => {
    const sessions = await repository.findSessionsByUserId('user-1');
    expect(sessions).toHaveLength(1);
    expect(sessions[0].userId).toBe('user-1');
  });

  it('should save message to repository', async () => {
    const message = ChatMessage.create(
      'msg-2',
      'session-1',
      MessageRole.USER,
      'Question?',
    );
    const saved = await repository.saveMessage(message);
    expect(saved.id).toBe('msg-1');
  });
});
