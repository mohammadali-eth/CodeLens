/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment */
/// <reference types="jest" />

import { AIService } from './ai.service';
import { AIProviderFactory } from '../infrastructure/factories/ai-provider.factory';
import { AISanitizerService } from '../infrastructure/sanitizer/ai-sanitizer.service';
import { AICacheService } from '../infrastructure/cache/ai-cache.service';
import { UnifiedAIResponse } from '../domain/unified-ai-response.interface';
import { TypeScriptAnalyzer } from './analyzers/typescript-analyzer';
import { SecurityAnalyzer } from './analyzers/security-analyzer';
import { ComplexityAnalyzer } from './analyzers/complexity-analyzer';
import { FindingMergeService } from './analyzers/finding-merge.service';
import { ScoringService } from './scoring/scoring.service';

describe('AIService', () => {
  let service: AIService;
  let providerFactoryMock: jest.Mocked<AIProviderFactory>;
  let sanitizerServiceMock: jest.Mocked<AISanitizerService>;
  let cacheServiceMock: jest.Mocked<AICacheService>;

  const sampleFiles = [
    {
      filename: 'test.ts',
      content: 'const x = 1;',
      language: 'TYPESCRIPT',
    },
  ];

  const mockResponse: UnifiedAIResponse = {
    summary: 'Test summary',
    explanation: 'Test explanation',
    bugs: [],
    errors: [],
    bestPractices: [],
    optimizations: [],
    cleanCodeSuggestions: [],
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    qualityScore: 90,
    improvedCode: { 'test.ts': 'const x = 1;' },
    processingTimeMs: 100,
    provider: 'mock',
    model: 'mock-v1',
    confidenceScore: 0.95,
    promptVersion: 'v1.0',
  };

  beforeEach(() => {
    const mockProvider = {
      providerName: 'mock',
      defaultModel: 'mock-v1',
      analyze: jest.fn().mockResolvedValue(mockResponse),
      healthCheck: jest.fn().mockResolvedValue(true),
    };

    providerFactoryMock = {
      getProvider: jest.fn().mockReturnValue(mockProvider),
      getFallbackProvider: jest.fn().mockReturnValue(mockProvider),
    } as any;

    sanitizerServiceMock = {
      sanitize: jest.fn((content: string) => content),
    } as any;

    cacheServiceMock = {
      generateCacheKey: jest.fn().mockReturnValue('ai:analysis:key'),
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      invalidate: jest.fn().mockResolvedValue(undefined),
    } as any;

    const tsAnalyzer = new TypeScriptAnalyzer();
    const securityAnalyzer = new SecurityAnalyzer();
    const complexityAnalyzer = new ComplexityAnalyzer();
    const mergeService = new FindingMergeService();
    const scoringService = new ScoringService();

    service = new AIService(
      providerFactoryMock,
      sanitizerServiceMock,
      cacheServiceMock,
      tsAnalyzer,
      securityAnalyzer,
      complexityAnalyzer,
      mergeService,
      scoringService,
    );
  });

  it('should sanitize code, call primary provider and cache result', async () => {
    const result = await service.analyzeCode(sampleFiles);

    expect(sanitizerServiceMock.sanitize).toHaveBeenCalledWith('const x = 1;');
    expect(providerFactoryMock.getProvider).toHaveBeenCalled();
    expect(cacheServiceMock.set).toHaveBeenCalledWith(
      'ai:analysis:key',
      expect.objectContaining({ summary: 'Test summary', provider: 'mock' }),
    );
    expect(result.summary).toBe('Test summary');
  });

  it('should return cached result if present', async () => {
    cacheServiceMock.get.mockResolvedValueOnce(mockResponse);

    const result = await service.analyzeCode(sampleFiles);

    expect(cacheServiceMock.get).toHaveBeenCalled();
    expect(result.summary).toBe('Test summary');
  });
});
