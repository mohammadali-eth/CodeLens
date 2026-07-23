import { Severity } from '../../review/domain/severity.enum';

export interface RawAIFileIssue {
  filename: string;
  line: number;
  severity: Severity;
  type: string;
  message: string;
  suggestion: string | null;
}

export interface AIAnalysisResult {
  summary: string;
  issues: RawAIFileIssue[];
  providerUsed: string;
}
