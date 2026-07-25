import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { IChatRepository } from '../ports/chat-repository.interface';
import { ChatSession } from '../../domain/chat-session.entity';
import { UpdateChatSessionDto } from '../../infrastructure/controllers/dtos/update-chat-session.dto';

@Injectable()
export class UpdateChatSessionUseCase {
  constructor(
    @Inject(IChatRepository)
    private readonly chatRepository: IChatRepository,
  ) {}

  async execute(
    sessionId: string,
    userId: string,
    dto: UpdateChatSessionDto,
  ): Promise<ChatSession> {
    const session = await this.chatRepository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundException(
        `ChatSession with ID "${sessionId}" was not found`,
      );
    }

    if (session.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this chat session',
      );
    }

    let updatedSession = session;

    if (dto.title !== undefined) {
      updatedSession = updatedSession.rename(dto.title);
    }

    if (dto.isPinned !== undefined) {
      updatedSession = updatedSession.togglePin(dto.isPinned);
    }

    return this.chatRepository.saveSession(updatedSession);
  }
}
