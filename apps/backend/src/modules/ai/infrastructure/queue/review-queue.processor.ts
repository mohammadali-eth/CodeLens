import { Injectable, Logger } from '@nestjs/common';
import { AnalyzeCodeReviewUseCase } from '../../application/use-cases/analyze-code-review.use-case';
import { ReviewJobData } from './review-queue.producer';

@Injectable()
export class ReviewQueueProcessor {
  private readonly logger = new Logger(ReviewQueueProcessor.name);
  private readonly maxRetries = 3;

  constructor(private readonly analyzeUseCase: AnalyzeCodeReviewUseCase) {}

  async processJob(jobData: ReviewJobData): Promise<void> {
    const { reviewId, providerChoice } = jobData;
    this.logger.log(`Processing queue job for review ID: ${reviewId}`);

    let attempt = 0;
    let success = false;

    while (attempt < this.maxRetries && !success) {
      attempt++;
      try {
        await this.analyzeUseCase.execute(reviewId, providerChoice);
        success = true;
        this.logger.log(
          `Successfully completed review job for review ID: ${reviewId} on attempt ${attempt}`,
        );
      } catch (error) {
        const errMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.error(
          `Attempt ${attempt}/${this.maxRetries} failed for review ID ${reviewId}: ${errMessage}`,
        );

        if (attempt >= this.maxRetries) {
          this.logger.error(
            `Exhausted max retries (${this.maxRetries}) for review ID: ${reviewId}`,
          );
          throw error;
        }

        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000),
        );
      }
    }
  }
}
