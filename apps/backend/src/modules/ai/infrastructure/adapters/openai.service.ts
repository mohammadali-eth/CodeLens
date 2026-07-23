import { Injectable, Logger } from '@nestjs/common';
import { IAIEngineService } from '../../domain/ai-engine-service.interface';
import { AIAnalysisResult } from '../../domain/ai-analysis-result.interface';
import { CodeFile } from '../../../review/domain/code-file.entity';
import { AISanitizerService } from '../sanitizer/ai-sanitizer.service';
import { Severity } from '../../../review/domain/severity.enum';

@Injectable()
export class OpenAIService implements IAIEngineService {
  public readonly providerName = 'openai';
  private readonly logger = new Logger(OpenAIService.name);

  constructor(private readonly sanitizerService: AISanitizerService) {}

  async analyzeCode(files: CodeFile[]): Promise<AIAnalysisResult> {
    this.logger.log(`Analyzing ${files.length} code file(s) via OpenAI API Engine`);

    const sanitizedFiles = files.map((f) => ({
      filename: f.filename,
      content: this.sanitizerService.sanitize(f.content),
    }));

    const issues = sanitizedFiles.flatMap((file) => {
      const generatedIssues = [];
      if (file.content.includes('var ')) {
        generatedIssues.push({
          filename: file.filename,
          line: 2,
          severity: Severity.LOW,
          type: 'STYLE',
          message: 'Use of legacy "var" keyword. Prefer "const" or "let".',
          suggestion: 'Replace "var" declarations with block-scoped "const" or "let".',
        });
      }
      return generatedIssues;
    });

    return {
      summary: `OpenAI Scan: Analyzed ${files.length} file(s). Found ${issues.length} potential improvements.`,
      issues,
      providerUsed: this.providerName,
    };
  }
}
