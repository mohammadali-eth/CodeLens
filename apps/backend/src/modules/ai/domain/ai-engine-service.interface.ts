import { CodeFile } from '../../review/domain/code-file.entity';
import { AIAnalysisResult } from './ai-analysis-result.interface';

export interface IAIEngineService {
  readonly providerName: string;
  analyzeCode(files: CodeFile[]): Promise<AIAnalysisResult>;
}

export const IAIEngineService = Symbol('IAIEngineService');
