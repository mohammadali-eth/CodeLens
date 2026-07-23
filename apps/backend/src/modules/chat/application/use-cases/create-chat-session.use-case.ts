import { Inject, Injectable } from '@nestjs/common';
import { IChatRepository } from '../ports/chat-repository.interface';
import { ChatSession } from '../../domain/chat-session.entity';

@Injectable()
export class CreateChatSessionUseCase {
  constructor(
    @Inject(IChatRepository)
    private readonly chatRepository: IChatRepository,
  ) {}

  async execute(userId: string, title?: string): Promise<ChatSession> {
    const sessionTitle = title || `AI Code Assistant - ${new Date().toLocaleDateString()}`;
    const session = ChatSession.create(crypto.randomUUID(), userId, sessionTitle);
    return this.chatRepository.saveSession(session);
  }
}
