/**
 * UserSettings Domain Models & Interfaces
 * Purpose: Defines structured settings data contracts for appearance, editor, AI, notifications, and privacy.
 * Responsibilities: Provides domain contracts and default configurations.
 * Dependencies: None
 */

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSizeOption = 'small' | 'medium' | 'large';
export type WordWrapOption = 'off' | 'on' | 'wordWrapColumn';
export type LineNumbersOption = 'on' | 'off' | 'relative';
export type AutoSaveOption = 'off' | 'afterDelay' | 'onFocusChange';
export type DetailLevelOption = 'concise' | 'balanced' | 'exhaustive';
export type ExplanationStyleOption = 'architectural' | 'security-first' | 'code-only' | 'step-by-step';
export type ProfileVisibilityOption = 'public' | 'organization' | 'private';

export interface AppearancePreferences {
  theme: ThemeMode;
  fontSize: FontSizeOption;
  editorFont: string;
  editorTheme: string;
  compactMode: boolean;
}

export interface EditorPreferences {
  wordWrap: WordWrapOption;
  minimap: boolean;
  lineNumbers: LineNumbersOption;
  autoSave: AutoSaveOption;
  tabSize: number;
  fontFamily: string;
  fontSize: number;
  defaultLanguage: string;
}

export interface AIPreferences {
  defaultAIProvider: 'gemini' | 'openai' | 'anthropic';
  defaultAIModel: string;
  responseDetailLevel: DetailLevelOption;
  preferredExplanationStyle: ExplanationStyleOption;
  streamingResponses: boolean;
  autoAnalyze: boolean;
  temperature: number;
  maxTokens: number;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  reviewCompleted: boolean;
  reportGenerated: boolean;
  aiChatUpdates: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
}

export interface PrivacyPreferences {
  profileVisibility: ProfileVisibilityOption;
  shareReportsByDefault: boolean;
  analyticsParticipation: boolean;
}

export interface UserSettings {
  id?: string;
  userId?: string;
  appearance: AppearancePreferences;
  editor: EditorPreferences;
  ai: AIPreferences;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  updatedAt?: string;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  appearance: {
    theme: 'dark',
    fontSize: 'medium',
    editorFont: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
    editorTheme: 'vs-dark',
    compactMode: false,
  },
  editor: {
    wordWrap: 'on',
    minimap: true,
    lineNumbers: 'on',
    autoSave: 'afterDelay',
    tabSize: 2,
    fontFamily: "'Fira Code', monospace",
    fontSize: 14,
    defaultLanguage: 'typescript',
  },
  ai: {
    defaultAIProvider: 'gemini',
    defaultAIModel: 'gemini-2.5-pro',
    responseDetailLevel: 'balanced',
    preferredExplanationStyle: 'architectural',
    streamingResponses: true,
    autoAnalyze: true,
    temperature: 0.2,
    maxTokens: 4096,
  },
  notifications: {
    emailNotifications: true,
    inAppNotifications: true,
    reviewCompleted: true,
    reportGenerated: true,
    aiChatUpdates: false,
    securityAlerts: true,
    marketingEmails: false,
  },
  privacy: {
    profileVisibility: 'organization',
    shareReportsByDefault: false,
    analyticsParticipation: true,
  },
};
