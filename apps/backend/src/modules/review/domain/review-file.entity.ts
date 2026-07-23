import { Severity } from './severity.enum';

export interface CodeIssue {
  id: string;
  line: number;
  severity: Severity;
  category: string;
  message: string;
  suggestion?: string | null;
  createdAt?: Date;
}

/**
 * ReviewFile Entity
 * Purpose: Domain entity representing a code file submitted for inspection.
 * Responsibilities: Enforces file content validation, issues registration, and improved code updates.
 * Dependencies: Severity enum, CodeIssue interface.
 * Future Extensibility: Supports diff line offsets and AST node attachments.
 */
export class ReviewFile {
  constructor(
    public readonly id: string,
    public readonly reviewId: string,
    public readonly filename: string,
    public readonly content: string,
    public readonly language: string,
    public readonly fileSize: number,
    public readonly storagePath: string | null = null,
    public readonly improvedCode: string | null = null,
    public readonly issues: CodeIssue[] = [],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.filename || this.filename.trim().length === 0) {
      throw new Error('Filename cannot be empty');
    }
    if (this.content === undefined || this.content === null) {
      throw new Error('File content cannot be null or undefined');
    }
  }

  public addIssue(issue: CodeIssue): ReviewFile {
    return new ReviewFile(
      this.id,
      this.reviewId,
      this.filename,
      this.content,
      this.language,
      this.fileSize,
      this.storagePath,
      this.improvedCode,
      [...this.issues, issue],
      this.createdAt,
      new Date(),
    );
  }

  public withImprovedCode(improvedCode: string): ReviewFile {
    return new ReviewFile(
      this.id,
      this.reviewId,
      this.filename,
      this.content,
      this.language,
      this.fileSize,
      this.storagePath,
      improvedCode,
      this.issues,
      this.createdAt,
      new Date(),
    );
  }

  public countIssuesBySeverity(severity: Severity): number {
    return this.issues.filter((issue) => issue.severity === severity).length;
  }

  public static create(
    id: string,
    reviewId: string,
    filename: string,
    content: string,
    language: string,
    storagePath?: string | null,
  ): ReviewFile {
    const sizeInBytes = Buffer.byteLength(content, 'utf-8');
    return new ReviewFile(
      id,
      reviewId,
      filename.trim(),
      content,
      language.toUpperCase(),
      sizeInBytes,
      storagePath || null,
      null,
      [],
      new Date(),
      new Date(),
    );
  }
}
