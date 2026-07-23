import { Injectable, BadRequestException } from '@nestjs/common';
import { IAIEngineService } from '../domain/ai-engine-service.interface';
import { GeminiService } from '../infrastructure/adapters/gemini.service';
import { OpenAIService } from '../infrastructure/adapters/openai.service';
import { OllamaService } from '../infrastructure/adapters/ollama.service';
import { AIProvider } from '../domain/ai-provider.enum';

@Injectable()
export class AIFactoryService {
  private readonly providers: Map<string, IAIEngineService>;

  constructor(
    private readonly geminiService: GeminiService,
    private readonly openAIService: OpenAIService,
    private readonly ollamaService: OllamaService,
  ) {
    this.providers = new Map<string, IAIEngineService>([
      [AIProvider.GEMINI, this.geminiService],
      [AIProvider.OPENAI, this.openAIService],
      [AIProvider.OLLAMA, this.ollamaService],
    ]);
  }

  public getProvider(providerName?: string): IAIEngineService {
    const selectedProvider = providerName?.toLowerCase() || process.env.DEFAULT_AI_PROVIDER || AIProvider.GEMINI;
    const service = this.providers.get(selectedProvider);

    if (!service) {
      throw new BadRequestException(`Unsupported AI Provider: "${selectedProvider}". Available options: gemini, openai, ollama`);
    }

    return service;
  }
}
