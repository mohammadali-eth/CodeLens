import { Severity } from './severity.enum';

export class Issue {
  constructor(
    public readonly id: string,
    public readonly fileId: string,
    public readonly line: number,
    public readonly severity: Severity,
    public readonly type: string, // e.g. SECURITY, COMPLEXITY, STYLE, BUG
    public readonly message: string,
    public readonly suggestion: string | null,
  ) {
    if (line < 1) {
      throw new Error('Issue line number must be greater than 0');
    }
    if (!message || message.trim().length === 0) {
      throw new Error('Issue message cannot be empty');
    }
  }

  public static create(
    id: string,
    fileId: string,
    line: number,
    severity: Severity,
    type: string,
    message: string,
    suggestion: string | null = null,
  ): Issue {
    return new Issue(id, fileId, line, severity, type, message, suggestion);
  }
}
