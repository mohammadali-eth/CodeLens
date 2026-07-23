import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ReviewModule } from '../review/review.module';
import { AISanitizerService } from './infrastructure/sanitizer/ai-sanitizer.service';
import { GeminiService } from './infrastructure/adapters/gemini.service';
import { OpenAIService } from './infrastructure/adapters/openai.service';
import { OllamaService } from './infrastructure/adapters/ollama.service';
import { AIFactoryService } from './application/ai-factory.service';
import { AnalyzeCodeReviewUseCase } from './application/use-cases/analyze-code-review.use-case';
import { AIController } from './infrastructure/controllers/ai.controller';

@Module({
  imports: [AuthModule, ReviewModule],
  controllers: [AIController],
  providers: [
    AISanitizerService,
    GeminiService,
    OpenAIService,
    OllamaService,
    AIFactoryService,
    AnalyzeCodeReviewUseCase,
  ],
  exports: [
    AIFactoryService,
    AnalyzeCodeReviewUseCase,
    AISanitizerService,
  ],
})
export class AIModule {}
