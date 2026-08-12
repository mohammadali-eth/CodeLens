import { Severity } from '../../review/domain/severity.enum';

export interface CodeIssuePayload {
  filename: string;
  line: number;
  severity: Severity;
  category:
    | 'BUG'
    | 'SECURITY'
    | 'PERFORMANCE'
    | 'STYLE'
    | 'COMPLEXITY'
    | 'BEST_PRACTICE'
    | 'RELIABILITY'
    | 'MAINTAINABILITY'
    | 'CORRECTNESS'
    | (string & {});
  message: string;
  suggestion?: string;
  confidenceScore?: number;
}

export interface TokenUsageMetrics {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface UnifiedAIResponse {
  summary: string;
  explanation: string;
  bugs: CodeIssuePayload[];
  errors: CodeIssuePayload[];
  bestPractices: CodeIssuePayload[];
  optimizations: CodeIssuePayload[];
  cleanCodeSuggestions: CodeIssuePayload[];
  timeComplexity: string;
  spaceComplexity: string;
  qualityScore: number; // 0 - 100
  improvedCode?: Record<string, string>; // filename -> refactored code snippet
  processingTimeMs: number;
  provider: string;
  model: string;
  confidenceScore: number; // 0.0 - 1.0
  promptVersion: string;
  tokenUsage?: TokenUsageMetrics;
  rawResponse?: string;
}
