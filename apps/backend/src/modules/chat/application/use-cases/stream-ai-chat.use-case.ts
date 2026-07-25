import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IChatRepository } from '../ports/chat-repository.interface';
import { ChatMessage } from '../../domain/chat-message.entity';
import { MessageRole } from '../../domain/message-role.enum';
import { ChatAttachment } from '../../domain/chat-attachment.value-object';
import { BuildChatContextUseCase } from './build-chat-context.use-case';
import { AIProviderFactory } from '../../../ai/infrastructure/factories/ai-provider.factory';

export interface StreamChatRequestOptions {
  sessionId: string;
  userId: string;
  prompt: string;
  fileId?: string;
  filename?: string;
  lineStart?: number;
  lineEnd?: number;
  snippet?: string;
  aiProvider?: string;
  onToken: (chunk: string) => void;
}

@Injectable()
export class StreamAIChatUseCase {
  private readonly logger = new Logger(StreamAIChatUseCase.name);

  constructor(
    @Inject(IChatRepository)
    private readonly chatRepository: IChatRepository,
    private readonly buildContextUseCase: BuildChatContextUseCase,
    private readonly providerFactory: AIProviderFactory,
  ) {}

  async execute(options: StreamChatRequestOptions): Promise<{
    userMessage: ChatMessage;
    assistantMessage: ChatMessage;
    fullText: string;
    totalTokens: number;
    durationMs: number;
  }> {
    const { sessionId, userId, prompt, onToken } = options;
    const startTime = Date.now();

    // 1. Ownership & Session Validation
    const session = await this.chatRepository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundException(
        `ChatSession with ID "${sessionId}" was not found`,
      );
    }

    if (session.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to post messages in this chat session',
      );
    }

    // 2. Build User Attachment if snippet/file provided
    const attachments: ChatAttachment[] = [];
    if (options.snippet || options.filename) {
      attachments.push(
        ChatAttachment.create(
          randomUUID(),
          'placeholder',
          options.filename || null,
          options.lineStart || null,
          options.lineEnd || null,
          options.snippet || null,
          options.fileId || null,
        ),
      );
    }

    // 3. Save User Message
    const userMessage = ChatMessage.create(
      randomUUID(),
      session.id,
      MessageRole.USER,
      prompt,
      { promptTokens: Math.ceil(prompt.length / 4) },
      attachments,
    );
    await this.chatRepository.saveMessage(userMessage);

    // 4. Build Context
    const context = await this.buildContextUseCase.execute(session, prompt);

    // 5. Execute Provider Streaming
    const targetProviderName = options.aiProvider || session.aiProvider;
    const provider = this.providerFactory.getProvider(targetProviderName);

    this.logger.log(
      `Streaming chat response via provider "${provider.providerName}" for session ${sessionId}`,
    );

    let fullText = '';
    try {
      const response = await provider.analyze(
        [
          {
            filename: options.filename || 'chat.query',
            content: `${context.systemPrompt}\n\n${context.userPrompt}`,
            language: 'text',
          },
        ],
        { timeoutMs: 45000 },
      );

      fullText =
        response.explanation || response.summary || 'Analysis complete.';

      // Simulate real-time streaming tokens for client
      const chunks = fullText.match(/.{1,12}/g) || [fullText];
      for (const chunk of chunks) {
        onToken(chunk);
        await new Promise((resolve) => setTimeout(resolve, 15));
      }
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Primary provider failed during streaming: ${errMessage}. Triggering fallback...`,
      );

      const fallbackProvider = this.providerFactory.getFallbackProvider(
        provider.providerName,
      );
      const fallbackResult = await fallbackProvider.analyze(
        [
          {
            filename: options.filename || 'chat.query',
            content: `${context.systemPrompt}\n\n${context.userPrompt}`,
            language: 'text',
          },
        ],
        { timeoutMs: 45000 },
      );

      fullText = fallbackResult.explanation || fallbackResult.summary;
      onToken(fullText);
    }

    const durationMs = Date.now() - startTime;
    const promptTokens = Math.ceil(
      (context.systemPrompt.length + context.userPrompt.length) / 4,
    );
    const completionTokens = Math.ceil(fullText.length / 4);
    const totalTokens = promptTokens + completionTokens;

    // 6. Save Assistant Response Message
    const assistantMessage = ChatMessage.create(
      randomUUID(),
      session.id,
      MessageRole.ASSISTANT,
      fullText,
      {
        promptTokens,
        completionTokens,
        totalTokens,
        processingTimeMs: durationMs,
        modelUsed: provider.defaultModel,
      },
    );

    await this.chatRepository.saveMessage(assistantMessage);

    // 7. Update Session Metrics
    const updatedSession = session
      .addMessage(userMessage)
      .addMessage(assistantMessage);
    await this.chatRepository.saveSession(updatedSession);

    return {
      userMessage,
      assistantMessage,
      fullText,
      totalTokens,
      durationMs,
    };
  }
}
