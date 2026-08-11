import { ScoringService } from './scoring.service';
import { Severity } from '../../../review/domain/severity.enum';
import { CodeIssuePayload } from '../../domain/unified-ai-response.interface';

describe('ScoringService', () => {
  let service: ScoringService;

  beforeEach(() => {
    service = new ScoringService();
  });

  it('should return 100/100 when there are zero findings', () => {
    const result = service.calculateScore([]);
    expect(result.overallScore).toBe(100);
    expect(result.totalFindings).toBe(0);
    expect(result.categoryScores.security).toBe(100);
    expect(result.categoryScores.correctness).toBe(100);
  });

  it('should deduct heavily for CRITICAL security vulnerabilities', () => {
    const findings: CodeIssuePayload[] = [
      {
        filename: 'auth.ts',
        line: 10,
        severity: Severity.CRITICAL,
        category: 'SECURITY',
        message: 'Hardcoded secret detected',
      },
    ];

    const result = service.calculateScore(findings);
    expect(result.overallScore).toBeLessThan(100);
    expect(result.categoryScores.security).toBe(70); // 100 - 30 penalty
    expect(result.severitySummary.critical).toBe(1);
  });

  it('should deduct points for multiple mixed issues across categories', () => {
    const findings: CodeIssuePayload[] = [
      {
        filename: 'db.ts',
        line: 5,
        severity: Severity.HIGH,
        category: 'SECURITY',
        message: 'SQL Injection vulnerability',
      },
      {
        filename: 'util.ts',
        line: 12,
        severity: Severity.MEDIUM,
        category: 'CORRECTNESS',
        message: 'Unhandled promise rejection',
      },
      {
        filename: 'style.ts',
        line: 1,
        severity: Severity.LOW,
        category: 'STYLE',
        message: 'Var declaration used',
      },
    ];

    const result = service.calculateScore(findings);
    expect(result.overallScore).toBeLessThan(90);
    expect(result.totalFindings).toBe(3);
    expect(result.severitySummary.high).toBe(1);
    expect(result.severitySummary.medium).toBe(1);
    expect(result.severitySummary.low).toBe(1);
  });

  it('should bound score between 0 and 100 even with extreme findings count', () => {
    const findings: CodeIssuePayload[] = Array(20).fill({
      filename: 'bad.ts',
      line: 1,
      severity: Severity.CRITICAL,
      category: 'SECURITY',
      message: 'Critical error',
    });

    const result = service.calculateScore(findings);
    expect(result.overallScore).toBe(0);
    expect(result.categoryScores.security).toBe(0);
  });
});
