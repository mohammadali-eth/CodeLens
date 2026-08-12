import { Injectable, Logger } from '@nestjs/common';
import { CodeFilePayload } from '../../domain/ai-engine-service.interface';
import { CodeIssuePayload } from '../../domain/unified-ai-response.interface';
import { Severity } from '../../../review/domain/severity.enum';

@Injectable()
export class SecurityAnalyzer {
  private readonly logger = new Logger(SecurityAnalyzer.name);

  private readonly SECRET_PATTERNS = [
    {
      name: 'OpenAI Secret API Key',
      regex: /sk-[a-zA-Z0-9]{32,}/g,
      severity: Severity.CRITICAL,
    },
    {
      name: 'AWS Access Key ID',
      regex: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
      severity: Severity.CRITICAL,
    },
    {
      name: 'Google API Key',
      regex: /AIzaSy[a-zA-Z0-9_-]{33}/g,
      severity: Severity.CRITICAL,
    },
    {
      name: 'GitHub Personal Access Token',
      regex: /ghp_[a-zA-Z0-9]{36}/g,
      severity: Severity.CRITICAL,
    },
    {
      name: 'Generic Private Key Header',
      regex: /-----BEGIN (?:RSA |EC |PGP )?PRIVATE KEY-----/g,
      severity: Severity.CRITICAL,
    },
    {
      name: 'Hardcoded Secret Assignment',
      regex: /(?:api_?key|secret|password|auth_?token|jwt_?secret)\s*[:=]\s*["']([^"'\s]{8,})["']/gi,
      severity: Severity.HIGH,
    },
  ];

  private readonly INJECTION_PATTERNS = [
    {
      name: 'SQL String Concatenation Vulnerability',
      regex: /(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\s+[\s\S]*?\+\s*[\w\.]+/gi,
      severity: Severity.HIGH,
      category: 'SECURITY',
      message: 'Possible SQL Injection: Direct string concatenation detected in SQL query formulation.',
      suggestion: 'Use parameterized queries or ORM query builders (e.g., Prisma, TypeORM).',
    },
    {
      name: 'Unsafe Code Execution (eval)',
      regex: /\beval\s*\(/g,
      severity: Severity.CRITICAL,
      category: 'SECURITY',
      message: 'Critical Security Risk: Usage of eval() enables arbitrary code execution.',
      suggestion: 'Remove eval() call and rewrite dynamic logic safely.',
    },
    {
      name: 'Dangerous Child Process Execution',
      regex: /\b(?:child_process|execSync|exec)\s*\(\s*[`"'].*\$\{|\bexec\s*\([^,)]*\+/g,
      severity: Severity.CRITICAL,
      category: 'SECURITY',
      message: 'Command Injection: Unsanitized input passed directly to child process shell execution.',
      suggestion: 'Use execFile or spawn with fixed argument arrays instead of shell execution.',
    },
    {
      name: 'DOM Cross-Site Scripting (XSS)',
      regex: /\bdangerouslySetInnerHTML|\binnerHTML\s*=/g,
      severity: Severity.MEDIUM,
      category: 'SECURITY',
      message: 'XSS Risk: Raw HTML injection detected via innerHTML / dangerouslySetInnerHTML.',
      suggestion: 'Sanitize content using DOMPurify before injecting dynamic HTML strings.',
    },
  ];

  analyze(files: CodeFilePayload[]): CodeIssuePayload[] {
    const findings: CodeIssuePayload[] = [];

    for (const file of files) {
      const lines = file.content.split('\n');

      // 1. Scan for Secrets
      for (let i = 0; i < lines.length; i++) {
        const lineContent = lines[i];

        for (const pattern of this.SECRET_PATTERNS) {
          pattern.regex.lastIndex = 0;
          if (pattern.regex.test(lineContent)) {
            // Ignore benign placeholder strings
            if (
              lineContent.includes('process.env') ||
              lineContent.includes('EXAMPLE') ||
              lineContent.includes('placeholder') ||
              lineContent.includes('YOUR_')
            ) {
              continue;
            }

            findings.push({
              filename: file.filename,
              line: i + 1,
              severity: pattern.severity,
              category: 'SECURITY',
              message: `Hardcoded Secret Detected: Found ${pattern.name} exposure in source code.`,
              suggestion: 'Extract sensitive API keys and credentials into environment variables (.env).',
              confidenceScore: 0.96,
            });
          }
        }
      }

      // 2. Scan for Injection & Insecure APIs
      for (let i = 0; i < lines.length; i++) {
        const lineContent = lines[i];

        for (const pattern of this.INJECTION_PATTERNS) {
          pattern.regex.lastIndex = 0;
          if (pattern.regex.test(lineContent)) {
            findings.push({
              filename: file.filename,
              line: i + 1,
              severity: pattern.severity,
              category: pattern.category,
              message: pattern.message,
              suggestion: pattern.suggestion,
              confidenceScore: 0.94,
            });
          }
        }
      }
    }

    return findings;
  }
}
