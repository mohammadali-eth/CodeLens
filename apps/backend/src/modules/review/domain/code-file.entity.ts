import { Issue } from './issue.entity';

export class CodeFile {
  constructor(
    public readonly id: string,
    public readonly reviewId: string,
    public readonly filename: string,
    public readonly content: string,
    public readonly language: string,
    public readonly issues: Issue[] = [],
  ) {
    if (!filename || filename.trim().length === 0) {
      throw new Error('Filename cannot be empty');
    }
  }

  public calculateLinesOfCode(): number {
    return this.content.split('\n').length;
  }

  public addIssue(issue: Issue): CodeFile {
    return new CodeFile(
      this.id,
      this.reviewId,
      this.filename,
      this.content,
      this.language,
      [...this.issues, issue],
    );
  }

  public static create(
    id: string,
    reviewId: string,
    filename: string,
    content: string,
    language: string,
    issues: Issue[] = [],
  ): CodeFile {
    return new CodeFile(id, reviewId, filename, content, language, issues);
  }
}
