/**
 * ChatAttachment Value Object
 * Purpose: Represents optional file snippets or code references attached to a chat message.
 * Responsibilities: Encapsulates target file, line bounds, and code snippet references.
 */
export class ChatAttachment {
  constructor(
    public readonly id: string,
    public readonly messageId: string,
    public readonly fileId: string | null = null,
    public readonly filename: string | null = null,
    public readonly lineStart: number | null = null,
    public readonly lineEnd: number | null = null,
    public readonly snippet: string | null = null,
    public readonly createdAt: Date = new Date(),
  ) {}

  public static create(
    id: string,
    messageId: string,
    filename?: string | null,
    lineStart?: number | null,
    lineEnd?: number | null,
    snippet?: string | null,
    fileId?: string | null,
  ): ChatAttachment {
    return new ChatAttachment(
      id,
      messageId,
      fileId || null,
      filename || null,
      lineStart || null,
      lineEnd || null,
      snippet || null,
      new Date(),
    );
  }
}
