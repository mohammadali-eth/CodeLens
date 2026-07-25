import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ReviewModule } from '../review/review.module';
import { AIModule } from '../ai/ai.module';
import { IChatRepository } from './application/ports/chat-repository.interface';
import { PrismaChatRepository } from './infrastructure/adapters/prisma-chat-repository';
import { RedisChatCacheService } from './infrastructure/cache/redis-chat-cache.service';
import { CreateChatSessionUseCase } from './application/use-cases/create-chat-session.use-case';
import { GetChatSessionUseCase } from './application/use-cases/get-chat-session.use-case';
import { UpdateChatSessionUseCase } from './application/use-cases/update-chat-session.use-case';
import { DeleteChatSessionUseCase } from './application/use-cases/delete-chat-session.use-case';
import { SendChatMessageUseCase } from './application/use-cases/send-chat-message.use-case';
import { StreamAIChatUseCase } from './application/use-cases/stream-ai-chat.use-case';
import { BuildChatContextUseCase } from './application/use-cases/build-chat-context.use-case';
import { GetSuggestedPromptsUseCase } from './application/use-cases/get-suggested-prompts.use-case';
import { ChatController } from './infrastructure/controllers/chat.controller';
import { ChatGateway } from './infrastructure/websockets/chat.gateway';

@Module({
  imports: [AuthModule, ReviewModule, AIModule],
  controllers: [ChatController],
  providers: [
    {
      provide: IChatRepository,
      useClass: PrismaChatRepository,
    },
    RedisChatCacheService,
    CreateChatSessionUseCase,
    GetChatSessionUseCase,
    UpdateChatSessionUseCase,
    DeleteChatSessionUseCase,
    SendChatMessageUseCase,
    StreamAIChatUseCase,
    BuildChatContextUseCase,
    GetSuggestedPromptsUseCase,
    ChatGateway,
  ],
  exports: [
    IChatRepository,
    RedisChatCacheService,
    CreateChatSessionUseCase,
    GetChatSessionUseCase,
    UpdateChatSessionUseCase,
    DeleteChatSessionUseCase,
    SendChatMessageUseCase,
    StreamAIChatUseCase,
    BuildChatContextUseCase,
    GetSuggestedPromptsUseCase,
    ChatGateway,
  ],
})
export class ChatModule {}
