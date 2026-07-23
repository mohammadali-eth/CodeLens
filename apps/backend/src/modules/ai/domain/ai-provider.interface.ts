import { UnifiedAIResponse } from './unified-ai-response.interface';
import { CodeFilePayload } from './ai-engine-service.interface';

export interface AIExecutionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  promptVersion?: string;
  timeoutMs?: number;
}

export interface IAIProvider {
  readonly providerName: string;
  readonly defaultModel: string;

  analyze(
    files: CodeFilePayload[],
    options?: AIExecutionOptions,
  ): Promise<UnifiedAIResponse>;

  healthCheck(): Promise<boolean>;
}

export const IAIProvider = Symbol('IAIProvider');
