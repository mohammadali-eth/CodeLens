import { Injectable, Logger } from '@nestjs/common';
import { CodeFilePayload } from '../../domain/ai-engine-service.interface';
import { CodeIssuePayload } from '../../domain/unified-ai-response.interface';

@Injectable()
export class FindingMergeService {
  private readonly logger = new Logger(FindingMergeService.name);

  /**
   * Validates findings evidence against submitted code files and deduplicates overlapping static & AI findings.
   */
  mergeAndValidate(
    staticFindings: CodeIssuePayload[],
    aiFindings: CodeIssuePayload[],
    submittedFiles: CodeFilePayload[],
  ): CodeIssuePayload[] {
    const validStatic = this.validateFindingsEvidence(staticFindings, submittedFiles);
    const validAi = this.validateFindingsEvidence(aiFindings, submittedFiles);

    const merged: CodeIssuePayload[] = [...validStatic];

    for (const aiFinding of validAi) {
      const isDuplicate = merged.some((existing) =>
        this.areFindingsDuplicate(existing, aiFinding),
      );

      if (!isDuplicate) {
        merged.push(aiFinding);
      }
    }

    return merged;
  }

  private validateFindingsEvidence(
    findings: CodeIssuePayload[],
    submittedFiles: CodeFilePayload[],
  ): CodeIssuePayload[] {
    const validFindings: CodeIssuePayload[] = [];
    const fileMap = new Map<string, { lineCount: number; contentLines: string[] }>();

    for (const f of submittedFiles) {
      const lines = f.content.split('\n');
      fileMap.set(f.filename, { lineCount: lines.length, contentLines: lines });
      fileMap.set(f.filename.split('/').pop() || f.filename, { lineCount: lines.length, contentLines: lines });
    }

    for (const finding of findings) {
      if (!finding.message || finding.message.trim().length === 0) {
        continue;
      }

      const fileInfo = fileMap.get(finding.filename) || fileMap.get(finding.filename?.split('/').pop() || '');

      // Rule 1: Reject findings referencing non-existent files if multi-file context is given
      if (!fileInfo && submittedFiles.length > 0) {
        this.logger.warn(`Rejecting hallucinated AI finding referencing non-existent file: ${finding.filename}`);
        continue;
      }

      let validatedLine = finding.line || 1;
      if (fileInfo) {
        // Rule 2: Clamp/normalize impossible line numbers
        if (validatedLine > fileInfo.lineCount) {
          validatedLine = fileInfo.lineCount > 0 ? fileInfo.lineCount : 1;
        }
        if (validatedLine < 1) {
          validatedLine = 1;
        }
      }

      validFindings.push({
        ...finding,
        line: validatedLine,
        confidenceScore: finding.confidenceScore || 0.90,
      });
    }

    return validFindings;
  }

  private areFindingsDuplicate(a: CodeIssuePayload, b: CodeIssuePayload): boolean {
    const fileA = a.filename?.split('/').pop() || '';
    const fileB = b.filename?.split('/').pop() || '';

    if (fileA !== fileB) {
      return false;
    }

    // Match exact line or adjacent line (+/- 2 lines)
    const lineDiff = Math.abs((a.line || 1) - (b.line || 1));
    if (lineDiff <= 2) {
      const catA = (a.category || '').toUpperCase();
      const catB = (b.category || '').toUpperCase();

      if (catA === catB) {
        return true;
      }

      // Check message similarity
      const msgA = a.message.toLowerCase();
      const msgB = b.message.toLowerCase();
      if (msgA.includes(msgB) || msgB.includes(msgA)) {
        return true;
      }
    }

    return false;
  }
}
