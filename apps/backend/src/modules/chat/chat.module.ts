import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AIModule } from '../ai/ai.module';
import { IChatRepository } from './application/ports/chat-repository.interface';
import { PrismaChatRepository } from './infrastructure/adapters/prisma-chat-repository';
import { CreateChatSessionUseCase } from './application/use-cases/create-chat-session.use-case';
import { SendChatMessageUseCase } from './application/use-cases/send-chat-message.use-case';
import { ChatController } from './infrastructure/controllers/chat.controller';

@Module({
  imports: [AuthModule, AIModule],
  controllers: [ChatController],
  providers: [
    CreateChatSessionUseCase,
    SendChatMessageUseCase,
    {
      provide: IChatRepository,
      useClass: PrismaChatRepository,
    },
  ],
  exports: [
    CreateChatSessionUseCase,
    SendChatMessageUseCase,
    IChatRepository,
  ],
})
export class ChatModule {}
