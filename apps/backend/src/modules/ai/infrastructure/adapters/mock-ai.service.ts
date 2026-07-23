import { Injectable, Logger } from '@nestjs/common';
import {
  IAIEngineService,
  CodeFilePayload,
} from '../../domain/ai-engine-service.interface';
import { AIAnalysisResult } from '../../domain/ai-analysis-result.interface';
import { Severity } from '../../../review/domain/severity.enum';

@Injectable()
export class MockAIService implements IAIEngineService {
  public readonly providerName = 'mock';
  private readonly logger = new Logger(MockAIService.name);

  analyzeCode(files: CodeFilePayload[]): Promise<AIAnalysisResult> {
    this.logger.log(`Mock AI Engine inspecting ${files.length} file(s)`);

    const issues = files.flatMap((file) => [
      {
        filename: file.filename,
        line: 10,
        severity: Severity.HIGH,
        type: 'SECURITY',
        message:
          'Mock Security Audit: Potential SQL Injection or unescaped string parameter.',
        suggestion:
          'Use parameterized queries or ORM bindings instead of string concatenation.',
      },
      {
        filename: file.filename,
        line: 25,
        severity: Severity.LOW,
        type: 'STYLE',
        message:
          'Mock Style Check: Inconsistent indenting or variable naming convention.',
        suggestion: 'Format code according to project linter guidelines.',
      },
    ]);

    return Promise.resolve({
      summary: `Mock AI Analysis complete. Inspected ${files.length} file(s). Found ${issues.length} mock issue(s).`,
      score: 92,
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
      issues,
      providerUsed: this.providerName,
    });
  }
}
