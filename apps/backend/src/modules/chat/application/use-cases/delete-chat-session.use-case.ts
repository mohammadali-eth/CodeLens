import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IChatRepository } from '../ports/chat-repository.interface';

@Injectable()
export class DeleteChatSessionUseCase {
  constructor(
    @Inject(IChatRepository)
    private readonly chatRepository: IChatRepository,
  ) {}

  async execute(sessionId: string, userId: string): Promise<void> {
    const session = await this.chatRepository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundException(
        `ChatSession with ID "${sessionId}" was not found`,
      );
    }

    if (session.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this chat session',
      );
    }

    await this.chatRepository.deleteSession(sessionId);
  }
}
