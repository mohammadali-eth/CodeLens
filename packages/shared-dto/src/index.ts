// Role and Auth Types
export enum Role {
  DEV = 'DEV',
  LEAD = 'LEAD',
  ADMIN = 'ADMIN',
}

export interface IUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: IUser;
}

// Review Types
export enum ReviewStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum Severity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface IIssue {
  id: string;
  fileId: string;
  line: number;
  severity: Severity;
  type: string;
  message: string;
  suggestion?: string | null;
}

export interface ICodeFile {
  id: string;
  reviewId: string;
  filename: string;
  content: string;
  language: string;
  issues: IIssue[];
}

export interface IReview {
  id: string;
  title: string;
  repository: string;
  branch: string;
  status: ReviewStatus;
  score: number | null;
  creatorId: string;
  files: ICodeFile[];
  createdAt: string;
  updatedAt: string;
}

// AI Chat Types
export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
}

export interface IChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface IChatSession {
  id: string;
  userId: string;
  title: string;
  messages: IChatMessage[];
  createdAt: string;
  updatedAt: string;
}
