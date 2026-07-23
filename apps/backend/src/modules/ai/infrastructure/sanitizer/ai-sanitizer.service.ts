import { Injectable } from '@nestjs/common';

@Injectable()
export class AISanitizerService {
  private readonly secretPatterns: RegExp[] = [
    // API Keys and Tokens
    /sk-[a-zA-Z0-9]{32,}/g, // OpenAI API Keys
    /AIzaSy[a-zA-Z0-9_-]{33}/g, // Google API Keys
    /AKIA[0-9A-Z]{16}/g, // AWS Access Keys
    /ghp_[a-zA-Z0-9]{36}/g, // GitHub Personal Access Tokens
    /eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g, // JWT Tokens
    // Passwords in connection strings
    /(postgres|mysql|mongodb):\/\/[^:]+:([^@]+)@/gi,
    /password\s*[:=]\s*["']([^"']+)["']/gi,
  ];

  public sanitize(codeContent: string): string {
    let sanitized = codeContent;

    // Mask sensitive API keys and tokens
    for (const pattern of this.secretPatterns) {
      sanitized = sanitized.replace(pattern, (match) => {
        if (match.includes('://')) {
          return match.replace(/:([^@]+)@/, ':***REDACTED***@');
        }
        return '***REDACTED_SECRET***';
      });
    }

    return sanitized;
  }
}
