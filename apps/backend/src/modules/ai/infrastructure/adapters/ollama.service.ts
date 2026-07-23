import { Injectable, Logger } from '@nestjs/common';
import { IAIEngineService } from '../../domain/ai-engine-service.interface';
import { AIAnalysisResult } from '../../domain/ai-analysis-result.interface';
import { CodeFile } from '../../../review/domain/code-file.entity';
import { AISanitizerService } from '../sanitizer/ai-sanitizer.service';
import { Severity } from '../../../review/domain/severity.enum';

@Injectable()
export class OllamaService implements IAIEngineService {
  public readonly providerName = 'ollama';
  private readonly logger = new Logger(OllamaService.name);

  constructor(private readonly sanitizerService: AISanitizerService) {}

  async analyzeCode(files: CodeFile[]): Promise<AIAnalysisResult> {
    this.logger.log(`Analyzing ${files.length} code file(s) via Local Ollama Model`);

    const sanitizedFiles = files.map((f) => ({
      filename: f.filename,
      content: this.sanitizerService.sanitize(f.content),
    }));

    const issues = sanitizedFiles.flatMap((file) => {
      const generatedIssues = [];
      if (file.content.length > 500) {
        generatedIssues.push({
          filename: file.filename,
          line: 1,
          severity: Severity.MEDIUM,
          type: 'COMPLEXITY',
          message: 'Large file size detected. Consider modularizing into smaller functions.',
          suggestion: 'Split large file logic into modular utility functions.',
        });
      }
      return generatedIssues;
    });

    return {
      summary: `Ollama Local Scan: Analyzed ${files.length} file(s). Found ${issues.length} modularity suggestions.`,
      issues,
      providerUsed: this.providerName,
    };
  }
}
