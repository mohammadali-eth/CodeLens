import { Injectable } from '@nestjs/common';
import { Severity } from '../../../review/domain/severity.enum';
import { CodeIssuePayload } from '../../domain/unified-ai-response.interface';

export interface CategoryScores {
  correctness: number;
  security: number;
  performance: number;
  maintainability: number;
  reliability: number;
  bestPractices: number;
}

export interface SeveritySummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

export interface ScoringResult {
  overallScore: number;
  categoryScores: CategoryScores;
  severitySummary: SeveritySummary;
  totalFindings: number;
}

/**
 * ScoringService
 * Deterministic quality score calculation based on findings, category impact, and severity penalties.
 */
@Injectable()
export class ScoringService {
  // Category weights (must sum to 1.0)
  private readonly WEIGHTS = {
    correctness: 0.3,
    security: 0.25,
    performance: 0.15,
    maintainability: 0.1,
    reliability: 0.1,
    bestPractices: 0.1,
  };

  // Severity point deductions per finding
  private readonly PENALTIES = {
    [Severity.CRITICAL]: 30,
    [Severity.HIGH]: 18,
    [Severity.MEDIUM]: 10,
    [Severity.LOW]: 4,
    [Severity.INFO]: 1,
  };

  calculateScore(findings: CodeIssuePayload[]): ScoringResult {
    const severitySummary: SeveritySummary = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };

    const categoryPenalties: Record<keyof CategoryScores, number> = {
      correctness: 0,
      security: 0,
      performance: 0,
      maintainability: 0,
      reliability: 0,
      bestPractices: 0,
    };

    let totalPenalty = 0;

    for (const finding of findings) {
      const severity = finding.severity || Severity.MEDIUM;
      const penalty = this.PENALTIES[severity] ?? 10;
      totalPenalty += penalty;

      // Count severity
      switch (severity) {
        case Severity.CRITICAL:
          severitySummary.critical++;
          break;
        case Severity.HIGH:
          severitySummary.high++;
          break;
        case Severity.MEDIUM:
          severitySummary.medium++;
          break;
        case Severity.LOW:
          severitySummary.low++;
          break;
        case Severity.INFO:
          severitySummary.info++;
          break;
      }

      // Map category to categoryPenalties
      const cat = (finding.category || 'BUG').toUpperCase();
      if (cat.includes('SECURITY') || cat.includes('VULNERABILITY')) {
        categoryPenalties.security += penalty;
      } else if (cat.includes('PERFORMANCE') || cat.includes('OPTIMIZATION')) {
        categoryPenalties.performance += penalty;
      } else if (cat.includes('MAINTAIN') || cat.includes('STYLE') || cat.includes('CLEAN')) {
        categoryPenalties.maintainability += penalty;
      } else if (cat.includes('RELIABILITY') || cat.includes('ERROR')) {
        categoryPenalties.reliability += penalty;
      } else if (cat.includes('BEST') || cat.includes('PRACTICE')) {
        categoryPenalties.bestPractices += penalty;
      } else {
        // Default to correctness for bugs / logic errors
        categoryPenalties.correctness += penalty;
      }
    }

    // Calculate category scores (start at 100, deduct penalties, min 0)
    const categoryScores: CategoryScores = {
      correctness: Math.max(0, 100 - categoryPenalties.correctness),
      security: Math.max(0, 100 - categoryPenalties.security),
      performance: Math.max(0, 100 - categoryPenalties.performance),
      maintainability: Math.max(0, 100 - categoryPenalties.maintainability),
      reliability: Math.max(0, 100 - categoryPenalties.reliability),
      bestPractices: Math.max(0, 100 - categoryPenalties.bestPractices),
    };

    // Weighted baseline calculation
    const weightedBaseline =
      categoryScores.correctness * this.WEIGHTS.correctness +
      categoryScores.security * this.WEIGHTS.security +
      categoryScores.performance * this.WEIGHTS.performance +
      categoryScores.maintainability * this.WEIGHTS.maintainability +
      categoryScores.reliability * this.WEIGHTS.reliability +
      categoryScores.bestPractices * this.WEIGHTS.bestPractices;

    // Apply global penalty cap so critical security or correctness flaws directly reduce overall score
    let calculatedScore = weightedBaseline;

    // Direct penalty deduction cap
    if (totalPenalty > 0) {
      calculatedScore = Math.min(calculatedScore, 100 - totalPenalty * 0.75);
    }

    // Security flaw cap: if security score is low, overall score cannot exceed security score + 25
    if (categoryScores.security < 100) {
      calculatedScore = Math.min(calculatedScore, categoryScores.security + 25);
    }

    // Correctness flaw cap
    if (categoryScores.correctness < 100) {
      calculatedScore = Math.min(calculatedScore, categoryScores.correctness + 25);
    }

    // Round to integer and bound between 0 and 100
    const overallScore = Math.min(100, Math.max(0, Math.round(calculatedScore)));

    return {
      overallScore,
      categoryScores,
      severitySummary,
      totalFindings: findings.length,
    };
  }
}
