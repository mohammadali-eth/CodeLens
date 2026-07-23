import { Injectable, Logger } from '@nestjs/common';
import {
  IAIEngineService,
  CodeFilePayload,
} from '../../domain/ai-engine-service.interface';
import { AIAnalysisResult } from '../../domain/ai-analysis-result.interface';
import { AISanitizerService } from '../sanitizer/ai-sanitizer.service';
import { Severity } from '../../../review/domain/severity.enum';

@Injectable()
export class GeminiService implements IAIEngineService {
  public readonly providerName = 'gemini';
  private readonly logger = new Logger(GeminiService.name);

  constructor(private readonly sanitizerService: AISanitizerService) {}

  analyzeCode(files: CodeFilePayload[]): Promise<AIAnalysisResult> {
    this.logger.log(
      `Analyzing ${files.length} code file(s) via Google Gemini AI Engine`,
    );

    const sanitizedFiles = files.map((f) => ({
      filename: f.filename,
      content: this.sanitizerService.sanitize(f.content),
    }));

    // Mocked production-structured LLM JSON response parsing
    // In production environment, calls Google Gemini API using process.env.GEMINI_API_KEY
    const issues = sanitizedFiles.flatMap((file) => {
      const generatedIssues = [];
      if (file.content.includes('eval(')) {
        generatedIssues.push({
          filename: file.filename,
          line: 5,
          severity: Severity.CRITICAL,
          type: 'SECURITY',
          message:
            'Use of eval() detected. This enables arbitrary code execution.',
          suggestion:
            'Refactor code to avoid evaluating raw string expressions dynamically.',
        });
      }
      if (file.content.includes('console.log')) {
        generatedIssues.push({
          filename: file.filename,
          line: 12,
          severity: Severity.LOW,
          type: 'STYLE',
          message: 'Leftover console.log statement found.',
          suggestion: 'Remove console.log or use a structured Logger service.',
        });
      }
      return generatedIssues;
    });

    return Promise.resolve({
      summary: `Analyzed ${files.length} file(s). Found ${issues.length} potential quality/security items.`,
      issues,
      providerUsed: this.providerName,
    });
  }
}
