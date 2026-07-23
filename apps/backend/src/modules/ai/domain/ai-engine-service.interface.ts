import { AIAnalysisResult } from './ai-analysis-result.interface';

export interface CodeFilePayload {
  filename: string;
  content: string;
  language?: string;
}

export interface IAIEngineService {
  readonly providerName: string;
  analyzeCode(files: CodeFilePayload[]): Promise<AIAnalysisResult>;
}

export const IAIEngineService = Symbol('IAIEngineService');
