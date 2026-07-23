import { Injectable, Logger } from '@nestjs/common';
import { IAIProvider } from '../../domain/ai-provider.interface';
import { GeminiProvider } from '../adapters/gemini-provider';
import { OpenAIProvider } from '../adapters/openai-provider';
import { OllamaProvider } from '../adapters/ollama-provider';
import { MockProvider } from '../adapters/mock-provider';

@Injectable()
export class AIProviderFactory {
  private readonly logger = new Logger(AIProviderFactory.name);
  private readonly providers = new Map<string, IAIProvider>();

  constructor(
    private readonly geminiProvider: GeminiProvider,
    private readonly openAIProvider: OpenAIProvider,
    private readonly ollamaProvider: OllamaProvider,
    private readonly mockProvider: MockProvider,
  ) {
    this.registerProvider(this.geminiProvider);
    this.registerProvider(this.openAIProvider);
    this.registerProvider(this.ollamaProvider);
    this.registerProvider(this.mockProvider);
  }

  private registerProvider(provider: IAIProvider): void {
    this.providers.set(provider.providerName.toLowerCase(), provider);
  }

  getProvider(providerName?: string): IAIProvider {
    const targetName = (
      providerName ||
      process.env.DEFAULT_AI_PROVIDER ||
      'gemini'
    ).toLowerCase();

    const provider = this.providers.get(targetName);
    if (!provider) {
      this.logger.warn(
        `Provider "${targetName}" not registered. Falling back to default GeminiProvider.`,
      );
      return this.geminiProvider;
    }

    return provider;
  }

  getFallbackProvider(failedProviderName: string): IAIProvider {
    const fallbackHierarchy = ['gemini', 'openai', 'ollama', 'mock'];
    const currentIndex = fallbackHierarchy.indexOf(
      failedProviderName.toLowerCase(),
    );

    for (let i = currentIndex + 1; i < fallbackHierarchy.length; i++) {
      const candidateName = fallbackHierarchy[i];
      const candidate = this.providers.get(candidateName);
      if (candidate) {
        this.logger.warn(
          `Fallback triggered: Switching from failed provider "${failedProviderName}" to "${candidateName}".`,
        );
        return candidate;
      }
    }

    return this.mockProvider;
  }
}
