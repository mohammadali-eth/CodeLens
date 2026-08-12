import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ReviewModule } from '../review/review.module';
import { AISanitizerService } from './infrastructure/sanitizer/ai-sanitizer.service';
import { GeminiService } from './infrastructure/adapters/gemini.service';
import { OpenAIService } from './infrastructure/adapters/openai.service';
import { OllamaService } from './infrastructure/adapters/ollama.service';
import { MockAIService } from './infrastructure/adapters/mock-ai.service';
import { AIFactoryService } from './application/ai-factory.service';
import { AnalyzeCodeReviewUseCase } from './application/use-cases/analyze-code-review.use-case';
import { AIController } from './infrastructure/controllers/ai.controller';
import { PromptTemplateRegistry } from './application/prompt-engine/prompt-template-registry';
import { GeminiProvider } from './infrastructure/adapters/gemini-provider';
import { OpenAIProvider } from './infrastructure/adapters/openai-provider';
import { OllamaProvider } from './infrastructure/adapters/ollama-provider';
import { MockProvider } from './infrastructure/adapters/mock-provider';
import { AIProviderFactory } from './infrastructure/factories/ai-provider.factory';
import { AIService } from './application/ai.service';
import { AIResponseParser } from './application/response-parser/ai-response-parser';
import { AICacheService } from './infrastructure/cache/ai-cache.service';
import { ReviewQueueProducer } from './infrastructure/queue/review-queue.producer';
import { ReviewQueueProcessor } from './infrastructure/queue/review-queue.processor';
import { ReviewEventsGateway } from './infrastructure/websockets/review-events.gateway';
import { ScoringService } from './application/scoring/scoring.service';
import { TypeScriptAnalyzer } from './application/analyzers/typescript-analyzer';
import { SecurityAnalyzer } from './application/analyzers/security-analyzer';
import { ComplexityAnalyzer } from './application/analyzers/complexity-analyzer';
import { FindingMergeService } from './application/analyzers/finding-merge.service';

@Module({
  imports: [AuthModule, forwardRef(() => ReviewModule)],
  controllers: [AIController],
  providers: [
    AISanitizerService,
    PromptTemplateRegistry,
    AIResponseParser,
    AICacheService,
    ScoringService,
    TypeScriptAnalyzer,
    SecurityAnalyzer,
    ComplexityAnalyzer,
    FindingMergeService,
    GeminiService,
    OpenAIService,
    OllamaService,
    MockAIService,
    GeminiProvider,
    OpenAIProvider,
    OllamaProvider,
    MockProvider,
    AIProviderFactory,
    AIFactoryService,
    AIService,
    AnalyzeCodeReviewUseCase,
    ReviewQueueProducer,
    ReviewQueueProcessor,
    ReviewEventsGateway,
  ],
  exports: [
    AIService,
    AICacheService,
    AIResponseParser,
    ScoringService,
    TypeScriptAnalyzer,
    SecurityAnalyzer,
    ComplexityAnalyzer,
    FindingMergeService,
    AIFactoryService,
    AIProviderFactory,
    AnalyzeCodeReviewUseCase,
    AISanitizerService,
    PromptTemplateRegistry,
    GeminiProvider,
    OpenAIProvider,
    OllamaProvider,
    MockProvider,
    ReviewQueueProducer,
    ReviewQueueProcessor,
    ReviewEventsGateway,
  ],
})
export class AIModule {}
