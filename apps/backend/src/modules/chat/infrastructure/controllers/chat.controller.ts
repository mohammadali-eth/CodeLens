import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { CreateChatSessionUseCase } from '../../application/use-cases/create-chat-session.use-case';
import { SendChatMessageUseCase } from '../../application/use-cases/send-chat-message.use-case';
import { IChatRepository } from '../../application/ports/chat-repository.interface';

class SendMessageDto {
  prompt!: string;
  provider?: string;
}

class CreateSessionDto {
  title?: string;
}

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly createChatSessionUseCase: CreateChatSessionUseCase,
    private readonly sendChatMessageUseCase: SendChatMessageUseCase,
    @Inject(IChatRepository)
    private readonly chatRepository: IChatRepository,
  ) {}

  @Post('sessions')
  async createSession(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateSessionDto,
  ) {
    return this.createChatSessionUseCase.execute(userId, dto.title);
  }

  @Get('sessions')
  async listSessions(@CurrentUser('sub') userId: string) {
    return this.chatRepository.findSessionsByUserId(userId);
  }

  @Get('sessions/:id')
  async getSession(@Param('id') id: string) {
    return this.chatRepository.findSessionById(id);
  }

  @Post('sessions/:id/messages')
  async sendMessage(
    @Param('id') sessionId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.sendChatMessageUseCase.execute(
      sessionId,
      dto.prompt,
      dto.provider,
    );
  }
}
