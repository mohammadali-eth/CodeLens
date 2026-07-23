import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReviewModule } from './modules/review/review.module';
import { AIModule } from './modules/ai/ai.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [DatabaseModule, AuthModule, ReviewModule, AIModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
