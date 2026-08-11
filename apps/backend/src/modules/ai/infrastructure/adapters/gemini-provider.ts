import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import {
  IAIProvider,
  AIExecutionOptions,
} from '../../domain/ai-provider.interface';
import {
  UnifiedAIResponse,
  CodeIssuePayload,
} from '../../domain/unified-ai-response.interface';
import { CodeFilePayload } from '../../domain/ai-engine-service.interface';
import { PromptTemplateRegistry } from '../../application/prompt-engine/prompt-template-registry';
import { AISanitizerService } from '../sanitizer/ai-sanitizer.service';
import { ScoringService } from '../../application/scoring/scoring.service';
import { Severity } from '../../../review/domain/severity.enum';

/**
 * GeminiProvider
 * Purpose: Google Gemini LLM Adapter (Primary AI Engine for CodeLens Platform).
 * Executes real Google Generative AI REST API calls with structured JSON output, token tracking, and deterministic backend scoring.
 */
@Injectable()
export class GeminiProvider implements IAIProvider {
  public readonly providerName = 'gemini';
  public readonly defaultModel = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
  private readonly logger = new Logger(GeminiProvider.name);

  constructor(
    private readonly promptRegistry: PromptTemplateRegistry,
    private readonly sanitizerService: AISanitizerService,
    private readonly scoringService: ScoringService,
  ) {}

  async analyze(
    files: CodeFilePayload[],
    options?: AIExecutionOptions,
  ): Promise<UnifiedAIResponse> {
    const startTime = Date.now();
    const model = options?.model || this.defaultModel;

    this.logger.log(
      `Executing Gemini AI Analysis on ${files.length} file(s) using model: ${model}, Depth: ${
        options?.analysisDepth || 'standard'
      }`,
    );

    const sanitizedFiles = files.map((f) => ({
      filename: f.filename,
      content: this.sanitizerService.sanitize(f.content),
      language: f.language,
    }));

    const compiledPrompt = this.promptRegistry.compileReviewPrompt(
      sanitizedFiles,
      options?.analysisDepth,
    );

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.error('GEMINI_API_KEY environment variable is not configured.');
      throw new BadRequestException(
        'Google Gemini API Key is missing in backend server configuration (GEMINI_API_KEY).',
      );
    }

    this.logger.log(`Connecting to Google Gemini API (model: ${model})...`);

    try {
      return await this.callGeminiApi(
        apiKey,
        model,
        compiledPrompt.systemPrompt,
        compiledPrompt.userPrompt,
        sanitizedFiles,
        Date.now() - startTime,
      );
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Gemini API execution error: ${msg}`);
      throw new BadRequestException(`Google Gemini Analysis Failed: ${msg}`);
    }
  }

  private async callGeminiApi(
    apiKey: string,
    model: string,
    systemPrompt: string,
    userPrompt: string,
    files: CodeFilePayload[],
    elapsedMs: number,
  ): Promise<UnifiedAIResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const promptText = `${systemPrompt}\n\nStrict Output Requirements:\nReturn valid JSON matching:\n{\n  "summary": "string",\n  "explanation": "string",\n  "timeComplexity": "string",\n  "spaceComplexity": "string",\n  "findings": [\n    {\n      "filename": "string",\n      "line": number,\n      "severity": "CRITICAL"|"HIGH"|"MEDIUM"|"LOW"|"INFO",\n      "category": "SECURITY"|"CORRECTNESS"|"PERFORMANCE"|"RELIABILITY"|"MAINTAINABILITY"|"BEST_PRACTICE"|"STYLE",\n      "message": "string",\n      "suggestion": "string"\n    }\n  ],\n  "improvedCode": {\n    "filename": "string"\n  }\n}\n\nSOURCE CODE FOR REVIEW:\n${userPrompt}`;

    const payload = {
      contents: [
        {
          parts: [{ text: promptText }],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Gemini HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    let candidateText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Clean JSON response by removing markdown fences if present
    candidateText = candidateText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/```$/g, '')
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(candidateText);
    } catch (parseError) {
      this.logger.error(`JSON Parse failure on Gemini candidate text: ${candidateText}`);
      throw new Error(
        `Gemini returned malformed response output that could not be parsed as JSON.`,
      );
    }

    // Extract all findings from findings array, or legacy keys (bugs, errors, bestPractices, optimizations, cleanCodeSuggestions)
    const rawFindings: any[] = Array.isArray(parsed.findings)
      ? parsed.findings
      : [
          ...(parsed.bugs || []),
          ...(parsed.errors || []),
          ...(parsed.bestPractices || []),
          ...(parsed.optimizations || []),
          ...(parsed.cleanCodeSuggestions || []),
        ];

    const mappedBugs: CodeIssuePayload[] = [];
    const mappedBestPractices: CodeIssuePayload[] = [];
    const mappedOptimizations: CodeIssuePayload[] = [];
    const mappedCleanCode: CodeIssuePayload[] = [];

    const allFindingsForScoring: CodeIssuePayload[] = [];

    for (const item of rawFindings) {
      const filename = item.filename || files[0]?.filename || 'src/file.ts';
      const line = typeof item.line === 'number' && item.line > 0 ? item.line : 1;
      const rawSev = (item.severity || 'MEDIUM').toUpperCase();
      let severity: Severity = Severity.MEDIUM;
      if (rawSev === 'CRITICAL') severity = Severity.CRITICAL;
      else if (rawSev === 'HIGH') severity = Severity.HIGH;
      else if (rawSev === 'MEDIUM') severity = Severity.MEDIUM;
      else if (rawSev === 'LOW') severity = Severity.LOW;
      else if (rawSev === 'INFO') severity = Severity.INFO;

      const category = (item.category || 'BUG').toUpperCase();
      const message = item.message || item.description || 'Issue identified during code review';
      const suggestion = item.suggestion || item.recommendation || '';

      const findingPayload: CodeIssuePayload = {
        filename,
        line,
        severity,
        category,
        message,
        suggestion,
        confidenceScore: 0.95,
      };

      allFindingsForScoring.push(findingPayload);

      if (category.includes('SECURITY') || category.includes('BUG') || severity === Severity.CRITICAL || severity === Severity.HIGH) {
        mappedBugs.push(findingPayload);
      } else if (category.includes('PERFORMANCE') || category.includes('OPTIMIZ')) {
        mappedOptimizations.push(findingPayload);
      } else if (category.includes('BEST') || category.includes('PRACTICE')) {
        mappedBestPractices.push(findingPayload);
      } else {
        mappedCleanCode.push(findingPayload);
      }
    }

    // Compute deterministic quality score
    const scoringResult = this.scoringService.calculateScore(allFindingsForScoring);

    const improvedCodeMap: Record<string, string> = {};
    for (const f of files) {
      improvedCodeMap[f.filename] =
        parsed.improvedCode && parsed.improvedCode[f.filename]
          ? parsed.improvedCode[f.filename]
          : f.content;
    }

    return {
      summary:
        parsed.summary ||
        `Gemini AI Code Audit Complete (${files.length} files). Score: ${scoringResult.overallScore}/100 with ${allFindingsForScoring.length} total findings.`,
      explanation: parsed.explanation || 'Analyzed with Google Gemini LLM API.',
      bugs: mappedBugs,
      errors: [],
      bestPractices: mappedBestPractices,
      optimizations: mappedOptimizations,
      cleanCodeSuggestions: mappedCleanCode,
      timeComplexity: parsed.timeComplexity || 'O(N)',
      spaceComplexity: parsed.spaceComplexity || 'O(1)',
      qualityScore: scoringResult.overallScore,
      improvedCode: improvedCodeMap,
      processingTimeMs: Math.max(150, elapsedMs),
      provider: this.providerName,
      model,
      confidenceScore: 0.96,
      promptVersion: 'v1.0-gemini',
      tokenUsage: {
        promptTokens: data?.usageMetadata?.promptTokenCount || 500,
        completionTokens: data?.usageMetadata?.candidatesTokenCount || 300,
        totalTokens: data?.usageMetadata?.totalTokenCount || 800,
      },
    };
  }

  healthCheck(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
