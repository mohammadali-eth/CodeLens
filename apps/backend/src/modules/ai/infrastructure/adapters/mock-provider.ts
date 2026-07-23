import { Injectable, Logger } from '@nestjs/common';
import {
  IAIProvider,
  AIExecutionOptions,
} from '../../domain/ai-provider.interface';
import { UnifiedAIResponse } from '../../domain/unified-ai-response.interface';
import { CodeFilePayload } from '../../domain/ai-engine-service.interface';
import { Severity } from '../../../review/domain/severity.enum';

@Injectable()
export class MockProvider implements IAIProvider {
  public readonly providerName = 'mock';
  public readonly defaultModel = 'mock-v1';
  private readonly logger = new Logger(MockProvider.name);

  analyze(
    files: CodeFilePayload[],
    options?: AIExecutionOptions,
  ): Promise<UnifiedAIResponse> {
    const startTime = Date.now();
    const model = options?.model || this.defaultModel;

    this.logger.log(`Executing Mock AI Analysis on ${files.length} file(s)`);

    const improvedCodeMap: Record<string, string> = {};
    files.forEach((f) => {
      improvedCodeMap[f.filename] =
        `// Mock Refactored Code for ${f.filename}\n${f.content}`;
    });

    return Promise.resolve({
      summary: `Mock AI Engine scan finished for ${files.length} file(s).`,
      explanation: 'Deterministic mock analyzer execution payload.',
      bugs: [
        {
          filename: files[0]?.filename || 'index.ts',
          line: 1,
          severity: Severity.INFO,
          category: 'STYLE',
          message: 'Mock verification check passed.',
          suggestion: 'No action required.',
          confidenceScore: 1.0,
        },
      ],
      errors: [],
      bestPractices: [],
      optimizations: [],
      cleanCodeSuggestions: [],
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      qualityScore: 95,
      improvedCode: improvedCodeMap,
      processingTimeMs: Date.now() - startTime + 10,
      provider: this.providerName,
      model,
      confidenceScore: 1.0,
      promptVersion: 'v1.0',
      tokenUsage: {
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
      },
    });
  }

  healthCheck(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
