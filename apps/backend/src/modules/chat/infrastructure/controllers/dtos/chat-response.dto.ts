import { MessageRole } from '../../../domain/message-role.enum';

export class ChatAttachmentResponseDto {
  id!: string;
  fileId!: string | null;
  filename!: string | null;
  lineStart!: number | null;
  lineEnd!: number | null;
  snippet!: string | null;
  createdAt!: Date;
}

export class ChatMessageResponseDto {
  id!: string;
  sessionId!: string;
  role!: MessageRole;
  content!: string;
  promptTokens!: number;
  completionTokens!: number;
  totalTokens!: number;
  processingTimeMs!: number | null;
  modelUsed!: string | null;
  attachments!: ChatAttachmentResponseDto[];
  createdAt!: Date;
}

export class ChatSessionResponseDto {
  id!: string;
  userId!: string;
  reviewId!: string | null;
  title!: string;
  isPinned!: boolean;
  aiProvider!: string;
  aiModel!: string | null;
  totalTokens!: number;
  messages!: ChatMessageResponseDto[];
  createdAt!: Date;
  updatedAt!: Date;
}
