import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IChatRepository } from '../ports/chat-repository.interface';
import { ChatMessage } from '../../domain/chat-message.entity';
import { MessageRole } from '../../domain/message-role.enum';
import { ChatAttachment } from '../../domain/chat-attachment.value-object';
import { SendChatMessageDto } from '../../infrastructure/controllers/dtos/send-chat-message.dto';
import { AIService } from '../../../ai/application/ai.service';

@Injectable()
export class SendChatMessageUseCase {
  constructor(
    @Inject(IChatRepository)
    private readonly chatRepository: IChatRepository,
    private readonly aiService: AIService,
  ) {}

  async execute(
    userId: string,
    dto: SendChatMessageDto,
  ): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
    const session = await this.chatRepository.findSessionById(dto.sessionId);
    if (!session) {
      throw new NotFoundException(
        `ChatSession with ID "${dto.sessionId}" was not found`,
      );
    }

    if (session.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to post messages in this session',
      );
    }

    // 1. Build Attachment if provided
    const attachments: ChatAttachment[] = [];
    if (dto.snippet || dto.filename) {
      attachments.push(
        ChatAttachment.create(
          randomUUID(),
          'placeholder',
          dto.filename || null,
          dto.lineStart || null,
          dto.lineEnd || null,
          dto.snippet || null,
          dto.fileId || null,
        ),
      );
    }

    // 2. Save User Message
    const userMessage = ChatMessage.create(
      randomUUID(),
      session.id,
      MessageRole.USER,
      dto.content,
      { promptTokens: Math.ceil(dto.content.length / 4) },
      attachments,
    );
    await this.chatRepository.saveMessage(userMessage);

    // 3. Execute AI response via AIService
    const startTime = Date.now();
    const provider = dto.aiProvider || session.aiProvider;

    const aiResponse = await this.aiService.analyzeCode(
      [
        {
          filename: dto.filename || 'context.code',
          content: dto.snippet || dto.content,
          language: 'auto',
        },
      ],
      { preferredProvider: provider },
    );

    const processingTimeMs = Date.now() - startTime;

    // 4. Save Assistant Response Message
    const assistantMessage = ChatMessage.create(
      randomUUID(),
      session.id,
      MessageRole.ASSISTANT,
      aiResponse.explanation || aiResponse.summary,
      {
        promptTokens: aiResponse.tokenUsage?.promptTokens || 100,
        completionTokens: aiResponse.tokenUsage?.completionTokens || 150,
        totalTokens: aiResponse.tokenUsage?.totalTokens || 250,
        processingTimeMs,
        modelUsed: aiResponse.model,
      },
    );

    await this.chatRepository.saveMessage(assistantMessage);

    // 5. Update session total tokens
    const updatedSession = session
      .addMessage(userMessage)
      .addMessage(assistantMessage);
    await this.chatRepository.saveSession(updatedSession);

    return { userMessage, assistantMessage };
  }
}
