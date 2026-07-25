import { Inject, Injectable } from '@nestjs/common';
import { IReviewRepository } from '../../../review/application/ports/review-repository.interface';
import { Severity } from '../../../review/domain/severity.enum';

export interface SuggestedPrompt {
  id: string;
  category: string;
  label: string;
  promptText: string;
}

@Injectable()
export class GetSuggestedPromptsUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(reviewId?: string): Promise<SuggestedPrompt[]> {
    const defaults: SuggestedPrompt[] = [
      {
        id: 'p-1',
        category: 'EXPLANATION',
        label: 'Explain Code',
        promptText:
          'Explain this function step-by-step and describe its control flow.',
      },
      {
        id: 'p-2',
        category: 'DEBUGGING',
        label: 'Analyze Bugs',
        promptText:
          'Why is this bug occurring and how can we prevent edge-case failures?',
      },
      {
        id: 'p-3',
        category: 'OPTIMIZATION',
        label: 'Optimize Algorithm',
        promptText:
          'Can this algorithm be optimized to reduce time and space complexity?',
      },
      {
        id: 'p-4',
        category: 'REFRACTORING',
        label: 'Thread Safety & Concurrency',
        promptText:
          'Make this code thread-safe and add robust exception handling.',
      },
      {
        id: 'p-5',
        category: 'TESTING',
        label: 'Generate Unit Tests',
        promptText:
          'Generate comprehensive unit tests covering edge cases and error paths.',
      },
      {
        id: 'p-6',
        category: 'MODERNIZATION',
        label: 'Convert & Modernize',
        promptText:
          'Convert this implementation to modern idiomatic patterns with strong typing.',
      },
    ];

    if (!reviewId) {
      return defaults;
    }

    const review = await this.reviewRepository.findById(reviewId);
    if (!review || !review.files.length) {
      return defaults;
    }

    const criticalIssues = review.files
      .flatMap((f) => f.issues)
      .filter(
        (i) => i.severity === Severity.CRITICAL || i.severity === Severity.HIGH,
      );

    if (criticalIssues.length > 0) {
      const topIssue = criticalIssues[0];
      defaults.unshift({
        id: 'p-priority',
        category: 'CRITICAL_FIX',
        label: `Fix ${topIssue.severity} Issue`,
        promptText: `Help me fix line ${topIssue.line} (${topIssue.category}): ${topIssue.message}`,
      });
    }

    return defaults;
  }
}
