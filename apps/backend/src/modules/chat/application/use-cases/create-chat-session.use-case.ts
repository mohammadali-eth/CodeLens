import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IChatRepository } from '../ports/chat-repository.interface';
import { ChatSession } from '../../domain/chat-session.entity';
import { CreateChatSessionDto } from '../../infrastructure/controllers/dtos/create-chat-session.dto';
import { IReviewRepository } from '../../../review/application/ports/review-repository.interface';

@Injectable()
export class CreateChatSessionUseCase {
  constructor(
    @Inject(IChatRepository)
    private readonly chatRepository: IChatRepository,
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(
    userId: string,
    dto: CreateChatSessionDto,
  ): Promise<ChatSession> {
    if (dto.reviewId) {
      const review = await this.reviewRepository.findById(dto.reviewId);
      if (!review) {
        throw new NotFoundException(
          `Review with ID "${dto.reviewId}" was not found`,
        );
      }
    }

    const title = dto.title || 'Code Review Assistant Chat';
    const session = ChatSession.create(
      randomUUID(),
      userId,
      title,
      dto.reviewId || null,
      dto.aiProvider || 'gemini',
      dto.aiModel || null,
    );

    return this.chatRepository.saveSession(session);
  }
}
