import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IReviewRepository } from '../../../review/application/ports/review-repository.interface';
import { AIFactoryService } from '../ai-factory.service';
import { Review } from '../../../review/domain/review.entity';
import {
  ReviewFile,
  CodeIssue,
} from '../../../review/domain/review-file.entity';
import { Severity } from '../../../review/domain/severity.enum';

@Injectable()
export class AnalyzeCodeReviewUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
    private readonly aiFactoryService: AIFactoryService,
  ) {}

  async execute(reviewId: string, providerChoice?: string): Promise<Review> {
    const startTime = Date.now();
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException(`Review with ID "${reviewId}" was not found`);
    }

    const aiProvider = this.aiFactoryService.getProvider(
      providerChoice || review.aiProvider,
    );
    const analysisResult = await aiProvider.analyzeCode(
      review.files.map((f) => ({
        filename: f.filename,
        content: f.content,
        language: f.language,
      })),
    );

    const updatedFiles: ReviewFile[] = review.files.map((file) => {
      const fileIssues: CodeIssue[] = analysisResult.issues
        .filter((issue) => issue.filename === file.filename)
        .map((issue) => ({
          id: randomUUID(),
          line: issue.line,
          severity: issue.severity || Severity.MEDIUM,
          category: issue.type || 'GENERAL',
          message: issue.message,
          suggestion: issue.suggestion,
        }));

      let updatedFile = file;
      for (const issue of fileIssues) {
        updatedFile = updatedFile.addIssue(issue);
      }
      return updatedFile;
    });

    const duration = Date.now() - startTime;

    const completedReview = review.completeAnalysis(
      analysisResult.summary || 'Code review completed successfully.',
      analysisResult.score || 85,
      analysisResult.timeComplexity || 'O(N)',
      analysisResult.spaceComplexity || 'O(1)',
      duration,
      updatedFiles,
    );

    return this.reviewRepository.update(completedReview);
  }
}
