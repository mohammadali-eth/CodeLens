import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IChatRepository } from '../ports/chat-repository.interface';
import { ChatSession } from '../../domain/chat-session.entity';

@Injectable()
export class GetChatSessionUseCase {
  constructor(
    @Inject(IChatRepository)
    private readonly chatRepository: IChatRepository,
  ) {}

  async execute(sessionId: string, userId: string): Promise<ChatSession> {
    const session = await this.chatRepository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundException(
        `ChatSession with ID "${sessionId}" was not found`,
      );
    }

    if (session.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this chat session',
      );
    }

    return session;
  }

  async listUserSessions(userId: string): Promise<ChatSession[]> {
    return this.chatRepository.findSessionsByUserId(userId);
  }

  async listReviewSessions(
    reviewId: string,
    userId: string,
  ): Promise<ChatSession[]> {
    const sessions = await this.chatRepository.findSessionsByReviewId(reviewId);
    return sessions.filter((s) => s.userId === userId);
  }
}
