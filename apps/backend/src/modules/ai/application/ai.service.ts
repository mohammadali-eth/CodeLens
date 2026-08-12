import { Injectable, Logger } from '@nestjs/common';
import { CodeFilePayload } from '../domain/ai-engine-service.interface';
import { AIExecutionOptions } from '../domain/ai-provider.interface';
import { UnifiedAIResponse, CodeIssuePayload } from '../domain/unified-ai-response.interface';
import { AIProviderFactory } from '../infrastructure/factories/ai-provider.factory';
import { AISanitizerService } from '../infrastructure/sanitizer/ai-sanitizer.service';
import { AICacheService } from '../infrastructure/cache/ai-cache.service';
import { TypeScriptAnalyzer } from './analyzers/typescript-analyzer';
import { SecurityAnalyzer } from './analyzers/security-analyzer';
import { ComplexityAnalyzer } from './analyzers/complexity-analyzer';
import { FindingMergeService } from './analyzers/finding-merge.service';
import { ScoringService } from './scoring/scoring.service';
import { Severity } from '../../review/domain/severity.enum';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(
    private readonly providerFactory: AIProviderFactory,
    private readonly sanitizerService: AISanitizerService,
    private readonly cacheService: AICacheService,
    private readonly tsAnalyzer: TypeScriptAnalyzer,
    private readonly securityAnalyzer: SecurityAnalyzer,
    private readonly complexityAnalyzer: ComplexityAnalyzer,
    private readonly mergeService: FindingMergeService,
    private readonly scoringService: ScoringService,
  ) {}

  async analyzeCode(
    files: CodeFilePayload[],
    options?: {
      preferredProvider?: string;
      model?: string;
      temperature?: number;
      timeoutMs?: number;
      skipCache?: boolean;
      analysisDepth?: string;
    },
  ): Promise<UnifiedAIResponse> {
    const startTime = Date.now();
    const providerName = options?.preferredProvider || 'gemini';

    this.logger.log(
      `Starting Hybrid AI Analysis Pipeline for ${files.length} file(s). Provider: ${providerName}, Depth: ${
        options?.analysisDepth || 'standard'
      }`,
    );

    // 1. Sanitize input code files
    const sanitizedFiles = files.map((f) => ({
      filename: f.filename,
      content: this.sanitizerService.sanitize(f.content),
      language: f.language,
    }));

    // 2. Select AI Provider & Cache Lookup
    const provider = this.providerFactory.getProvider(providerName);

    const cacheKey = this.cacheService.generateCacheKey(
      sanitizedFiles,
      `${provider.providerName}:${options?.analysisDepth || 'standard'}`,
      'v2.0',
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

    // 3. Run Deterministic Static Analyzers
    const tsResult = this.tsAnalyzer.analyze(sanitizedFiles);
    const securityFindings = this.securityAnalyzer.analyze(sanitizedFiles);
    const complexityResult = this.complexityAnalyzer.analyze(sanitizedFiles);

    const deterministicStaticFindings: CodeIssuePayload[] = [
      ...tsResult.findings,
      ...securityFindings,
    ];

    const execOptions: AIExecutionOptions = {
      model: options?.model,
      temperature: options?.temperature,
      timeoutMs: options?.timeoutMs || 45000,
      analysisDepth: options?.analysisDepth || 'standard',
    };

    let aiRawResponse: UnifiedAIResponse | null = null;
    let aiError: string | null = null;

    try {
      this.logger.log(`Executing AI Reasoning Layer via active provider: ${provider.providerName}`);
      aiRawResponse = await provider.analyze(sanitizedFiles, execOptions);
    } catch (err: any) {
      aiError = err instanceof Error ? err.message : String(err);
      this.logger.warn(`AI Provider "${provider.providerName}" failed: ${aiError}. Proceeding with deterministic static analysis.`);
    }

    // 4. Extract raw AI findings
    const aiFindings: CodeIssuePayload[] = aiRawResponse
      ? [
          ...(aiRawResponse.bugs || []),
          ...(aiRawResponse.errors || []),
          ...(aiRawResponse.bestPractices || []),
          ...(aiRawResponse.optimizations || []),
          ...(aiRawResponse.cleanCodeSuggestions || []),
        ]
      : [];

    // 5. Merge & Validate Evidence across Static + AI Findings
    const finalMergedFindings = this.mergeService.mergeAndValidate(
      deterministicStaticFindings,
      aiFindings,
      sanitizedFiles,
    );

    // 6. Compute Final Deterministic Quality Score
    const scoringResult = this.scoringService.calculateScore(finalMergedFindings);

    // 7. Map Findings into Structured Categories
    const bugs: CodeIssuePayload[] = [];
    const bestPractices: CodeIssuePayload[] = [];
    const optimizations: CodeIssuePayload[] = [];
    const cleanCodeSuggestions: CodeIssuePayload[] = [];

    for (const item of finalMergedFindings) {
      const cat = (item.category || 'BUG').toUpperCase();
      if (
        cat.includes('SECURITY') ||
        cat.includes('CORRECTNESS') ||
        cat.includes('BUG') ||
        item.severity === Severity.CRITICAL ||
        item.severity === Severity.HIGH
      ) {
        bugs.push(item);
      } else if (cat.includes('PERFORMANCE') || cat.includes('OPTIMIZ') || cat.includes('COMPLEXITY')) {
        optimizations.push(item);
      } else if (cat.includes('BEST') || cat.includes('PRACTICE')) {
        bestPractices.push(item);
      } else {
        cleanCodeSuggestions.push(item);
      }
    }

    // 8. Determine Summary and Provider Metadata
    const activeProviderName = provider.providerName;
    const activeModelName = options?.model || provider.defaultModel;

    let summaryText = '';
    if (aiRawResponse && aiRawResponse.summary) {
      summaryText = aiRawResponse.summary.replace(/OpenAI Scan complete/gi, `${activeProviderName.toUpperCase()} Analysis complete`);
    } else if (aiError) {
      summaryText = `${activeProviderName.toUpperCase()} AI reasoning unavailable (${aiError}); static analysis completed. Score: ${scoringResult.overallScore}/100 with ${finalMergedFindings.length} issue(s).`;
    } else {
      summaryText = `${activeProviderName.toUpperCase()} Analysis complete. Inspected ${sanitizedFiles.length} file(s). Quality Score: ${scoringResult.overallScore}/100 with ${finalMergedFindings.length} finding(s).`;
    }

    const unifiedResponse: UnifiedAIResponse = {
      summary: summaryText,
      explanation: aiRawResponse?.explanation || complexityResult.explanation,
      bugs,
      errors: [],
      bestPractices,
      optimizations,
      cleanCodeSuggestions,
      timeComplexity: complexityResult.timeComplexity,
      spaceComplexity: complexityResult.spaceComplexity,
      qualityScore: scoringResult.overallScore,
      improvedCode: aiRawResponse?.improvedCode || {},
      processingTimeMs: Date.now() - startTime,
      provider: activeProviderName,
      model: activeModelName,
      confidenceScore: aiRawResponse?.confidenceScore || 0.95,
      promptVersion: 'v2.0-hybrid',
      tokenUsage: aiRawResponse?.tokenUsage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    };

    // 9. Store in Cache
    await this.cacheService.set(cacheKey, unifiedResponse);

    return unifiedResponse;
  }
}

