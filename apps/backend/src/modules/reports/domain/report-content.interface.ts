import { Severity } from '../../review/domain/severity.enum';

export interface IReportIssueSummary {
  id: string;
  fileId: string;
  fileName: string;
  line: number;
  severity: Severity;
  category: string;
  message: string;
  suggestion?: string | null;
}

export interface IReportFileAnalysis {
  fileId: string;
  filename: string;
  language: string;
  improvedCode?: string | null;
  issues: IReportIssueSummary[];
}

export interface IReportMetadata {
  reviewId: string;
  title: string;
  repository?: string | null;
  branch?: string | null;
  primaryLanguage: string;
  aiProvider: string;
  aiModel?: string | null;
  reviewerName?: string | null;
  reviewerEmail?: string | null;
  createdDate: Date;
  processingTimeMs?: number | null;
  totalFiles: number;
  totalIssues: number;
}

export interface IReportAnalysis {
  executiveSummary: string;
  qualityScore: number;
  explanation?: string | null;
  bugCount: number;
  criticalIssueCount: number;
  highIssueCount: number;
  mediumIssueCount: number;
  lowIssueCount: number;
  infoIssueCount: number;
  bestPractices: string[];
  optimizations: string[];
  cleanCodeRecommendations: string[];
  timeComplexity?: string | null;
  spaceComplexity?: string | null;
  files: IReportFileAnalysis[];
}

export interface IReportContent {
  metadata: IReportMetadata;
  analysis: IReportAnalysis;
  templateType: string;
  generatedAt: Date;
}
