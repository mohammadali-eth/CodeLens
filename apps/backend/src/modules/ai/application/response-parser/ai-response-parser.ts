import { Injectable, Logger } from '@nestjs/common';
import {
  UnifiedAIResponse,
  CodeIssuePayload,
} from '../../domain/unified-ai-response.interface';
import { Severity } from '../../../review/domain/severity.enum';

@Injectable()
export class AIResponseParser {
  private readonly logger = new Logger(AIResponseParser.name);

  parseAndNormalize(
    rawText: string,
    defaultProvider: string,
    defaultModel: string,
    processingTimeMs: number,
  ): UnifiedAIResponse {
    try {
      const cleanJsonStr = this.extractJsonString(rawText);
      const parsed = JSON.parse(cleanJsonStr) as Partial<UnifiedAIResponse>;

      return this.normalizePayload(
        parsed,
        defaultProvider,
        defaultModel,
        processingTimeMs,
        rawText,
      );
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to parse raw LLM output as JSON: ${errMessage}. Applying fallback schema normalization.`,
      );

      return this.buildFallbackResponse(
        rawText,
        defaultProvider,
        defaultModel,
        processingTimeMs,
      );
    }
  }

  private extractJsonString(raw: string): string {
    let text = raw.trim();

    // Strip Markdown ```json ... ``` blocks
    if (text.includes('```')) {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (match && match[1]) {
        text = match[1].trim();
      }
    }

    // Extract outer {} bounds if extra text surrounds JSON
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    return text;
  }

  private normalizePayload(
    parsed: Partial<UnifiedAIResponse>,
    defaultProvider: string,
    defaultModel: string,
    processingTimeMs: number,
    rawText: string,
  ): UnifiedAIResponse {
    const bugs = this.normalizeIssues(parsed.bugs);
    const errors = this.normalizeIssues(parsed.errors);
    const bestPractices = this.normalizeIssues(parsed.bestPractices);
    const optimizations = this.normalizeIssues(parsed.optimizations);
    const cleanCodeSuggestions = this.normalizeIssues(
      parsed.cleanCodeSuggestions,
    );

    return {
      summary: parsed.summary || 'Code analysis completed successfully.',
      explanation:
        parsed.explanation || 'Detailed code breakdown provided by AI engine.',
      bugs,
      errors,
      bestPractices,
      optimizations,
      cleanCodeSuggestions,
      timeComplexity: parsed.timeComplexity || 'O(N)',
      spaceComplexity: parsed.spaceComplexity || 'O(1)',
      qualityScore: Math.min(100, Math.max(0, parsed.qualityScore ?? 85)),
      improvedCode: parsed.improvedCode || {},
      processingTimeMs,
      provider: parsed.provider || defaultProvider,
      model: parsed.model || defaultModel,
      confidenceScore: Math.min(
        1.0,
        Math.max(0.0, parsed.confidenceScore ?? 0.95),
      ),
      promptVersion: parsed.promptVersion || 'v1.0',
      tokenUsage: parsed.tokenUsage || {
        promptTokens: 300,
        completionTokens: 200,
        totalTokens: 500,
      },
      rawResponse: rawText,
    };
  }

  private normalizeIssues(issues?: unknown[]): CodeIssuePayload[] {
    if (!Array.isArray(issues)) return [];

    return issues.map((item) => {
      const issue = item as Record<string, unknown>;
      const rawSeverity =
        typeof issue.severity === 'string' ? issue.severity : 'LOW';
      const severityStr = rawSeverity.toUpperCase();
      let severity: Severity = Severity.LOW;

      if (Object.values(Severity).includes(severityStr as Severity)) {
        severity = severityStr as Severity;
      }

      const filename =
        typeof issue.filename === 'string' ? issue.filename : 'unknown';
      const line = typeof issue.line === 'number' ? issue.line : 1;
      const category =
        typeof issue.category === 'string'
          ? issue.category.toUpperCase()
          : 'BUG';
      const message =
        typeof issue.message === 'string' ? issue.message : 'Issue detected';
      const suggestion =
        typeof issue.suggestion === 'string' ? issue.suggestion : undefined;
      const confidenceScore =
        typeof issue.confidenceScore === 'number'
          ? issue.confidenceScore
          : 0.95;

      return {
        filename,
        line,
        severity,
        category: category as CodeIssuePayload['category'],
        message,
        suggestion,
        confidenceScore,
      };
    });
  }

  private buildFallbackResponse(
    rawText: string,
    provider: string,
    model: string,
    processingTimeMs: number,
  ): UnifiedAIResponse {
    return {
      summary: 'AI Analysis completed with unstructured output.',
      explanation: rawText.substring(0, 500),
      bugs: [],
      errors: [],
      bestPractices: [],
      optimizations: [],
      cleanCodeSuggestions: [],
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      qualityScore: 80,
      improvedCode: {},
      processingTimeMs,
      provider,
      model,
      confidenceScore: 0.7,
      promptVersion: 'v1.0',
      rawResponse: rawText,
    };
  }
}
