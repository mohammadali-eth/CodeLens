import { Injectable, Logger } from '@nestjs/common';
import { CodeFilePayload } from '../domain/ai-engine-service.interface';
import { AIExecutionOptions } from '../domain/ai-provider.interface';
import { UnifiedAIResponse } from '../domain/unified-ai-response.interface';
import { AIProviderFactory } from '../infrastructure/factories/ai-provider.factory';
import { AISanitizerService } from '../infrastructure/sanitizer/ai-sanitizer.service';
import { AICacheService } from '../infrastructure/cache/ai-cache.service';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(
    private readonly providerFactory: AIProviderFactory,
    private readonly sanitizerService: AISanitizerService,
    private readonly cacheService: AICacheService,
  ) {}

  async analyzeCode(
    files: CodeFilePayload[],
    options?: {
      preferredProvider?: string;
      model?: string;
      temperature?: number;
      timeoutMs?: number;
      skipCache?: boolean;
    },
  ): Promise<UnifiedAIResponse> {
    const startTime = Date.now();

    this.logger.log(
      `Starting AI Analysis Pipeline for ${files.length} file(s). Preferred Provider: ${
        options?.preferredProvider || 'default'
      }`,
    );

    // 1. Sanitize code files
    const sanitizedFiles = files.map((f) => ({
      filename: f.filename,
      content: this.sanitizerService.sanitize(f.content),
      language: f.language,
    }));

    // 2. Select Provider
    let provider = this.providerFactory.getProvider(options?.preferredProvider);

    // 3. Cache lookup
    const cacheKey = this.cacheService.generateCacheKey(
      sanitizedFiles,
      provider.providerName,
      'v1.0',
    );

    if (!options?.skipCache) {
      const cachedResult = await this.cacheService.get(cacheKey);
      if (cachedResult) {
        this.logger.log(
          `Returning cached AI analysis result for key ${cacheKey}`,
        );
        return {
          ...cachedResult,
          processingTimeMs: Date.now() - startTime,
        };
      }
    }

    const execOptions: AIExecutionOptions = {
      model: options?.model,
      temperature: options?.temperature,
      timeoutMs: options?.timeoutMs || 30000,
    };

    let response: UnifiedAIResponse;

    try {
      this.logger.log(
        `Executing analysis via active provider: ${provider.providerName}`,
      );
      response = await provider.analyze(sanitizedFiles, execOptions);
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Primary provider "${provider.providerName}" failed: ${errMessage}. Attempting fallback execution...`,
      );

      provider = this.providerFactory.getFallbackProvider(
        provider.providerName,
      );
      this.logger.log(
        `Executing fallback analysis via provider: ${provider.providerName}`,
      );

      const fallbackResult = await provider.analyze(
        sanitizedFiles,
        execOptions,
      );
      response = {
        ...fallbackResult,
        processingTimeMs: Date.now() - startTime,
      };
    }

    // 4. Cache storing
    await this.cacheService.set(cacheKey, response);

    return response;
  }
}
