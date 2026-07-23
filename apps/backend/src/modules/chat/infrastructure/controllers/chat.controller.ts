import { Controller, Post, Get, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateChatSessionUseCase } from '../../application/use-cases/create-chat-session.use-case';
import { SendChatMessageUseCase } from '../../application/use-cases/send-chat-message.use-case';
import { IChatRepository } from '../../application/ports/chat-repository.interface';
import { Inject } from '@nestjs/common';

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
  async createSession(@Body() dto: CreateSessionDto, @Request() req: any) {
    const userId = req.user.sub;
    return this.createChatSessionUseCase.execute(userId, dto.title);
  }

  @Get('sessions')
  async listSessions(@Request() req: any) {
    const userId = req.user.sub;
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
    return this.sendChatMessageUseCase.execute(sessionId, dto.prompt, dto.provider);
  }
}
