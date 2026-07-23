import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IReviewRepository } from '../../../review/application/ports/review-repository.interface';
import { AIFactoryService } from '../ai-factory.service';
import { Review } from '../../../review/domain/review.entity';
import { Issue } from '../../../review/domain/issue.entity';
import { CodeFile } from '../../../review/domain/code-file.entity';

@Injectable()
export class AnalyzeCodeReviewUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
    private readonly aiFactoryService: AIFactoryService,
  ) {}

  async execute(reviewId: string, providerChoice?: string): Promise<Review> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException(`Review with ID "${reviewId}" was not found`);
    }

    const aiProvider = this.aiFactoryService.getProvider(providerChoice);
    const analysisResult = await aiProvider.analyzeCode(review.files);

    const updatedFiles: CodeFile[] = review.files.map((file: CodeFile) => {
      const fileIssues = analysisResult.issues
        .filter((issue) => issue.filename === file.filename)
        .map((issue) =>
          Issue.create(
            crypto.randomUUID(),
            file.id,
            issue.line,
            issue.severity,
            issue.type,
            issue.message,
            issue.suggestion,
          ),
        );

      return new CodeFile(
        file.id,
        file.reviewId,
        file.filename,
        file.content,
        file.language,
        fileIssues,
      );
    });

    const completedReview = review.completeReview(updatedFiles);
    return this.reviewRepository.update(completedReview);
  }
}
