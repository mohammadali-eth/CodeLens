import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IChatRepository } from '../ports/chat-repository.interface';
import { AISanitizerService } from '../../../ai/infrastructure/sanitizer/ai-sanitizer.service';
import { AIFactoryService } from '../../../ai/application/ai-factory.service';
import { ChatMessage } from '../../domain/chat-message.entity';
import { MessageRole } from '../../domain/message-role.enum';
import { CodeFile } from '../../../review/domain/code-file.entity';

@Injectable()
export class SendChatMessageUseCase {
  constructor(
    @Inject(IChatRepository)
    private readonly chatRepository: IChatRepository,
    private readonly sanitizerService: AISanitizerService,
    private readonly aiFactoryService: AIFactoryService,
  ) {}

  async execute(sessionId: string, prompt: string, providerChoice?: string): Promise<ChatMessage> {
    const session = await this.chatRepository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundException(`Chat session with ID "${sessionId}" was not found`);
    }

    const sanitizedPrompt = this.sanitizerService.sanitize(prompt);

    // Save user message
    const userMessage = ChatMessage.create(
      crypto.randomUUID(),
      sessionId,
      MessageRole.USER,
      sanitizedPrompt,
    );
    await this.chatRepository.saveMessage(userMessage);

    // Invoke selected AI Engine Strategy
    const aiProvider = this.aiFactoryService.getProvider(providerChoice);
    const virtualCodeFile = CodeFile.create(
      crypto.randomUUID(),
      'chat-file-context',
      'chat-prompt.txt',
      sanitizedPrompt,
      'plaintext',
    );

    const aiResult = await aiProvider.analyzeCode([virtualCodeFile]);
    const responseContent = `[${aiProvider.providerName.toUpperCase()}] ${aiResult.summary}\n\nKey Insights:\n` +
      (aiResult.issues.length > 0
        ? aiResult.issues.map((i: any) => `- ${i.message}`).join('\n')
        : 'Code structure looks clean with no immediate security or quality concerns flagged.');

    // Save assistant message
    const assistantMessage = ChatMessage.create(
      crypto.randomUUID(),
      sessionId,
      MessageRole.ASSISTANT,
      responseContent,
    );
    return this.chatRepository.saveMessage(assistantMessage);
  }
}
