import { Injectable, Logger } from '@nestjs/common';
import { ReviewQueueProcessor } from './review-queue.processor';

export interface ReviewJobData {
  reviewId: string;
  providerChoice?: string;
}

@Injectable()
export class ReviewQueueProducer {
  private readonly logger = new Logger(
    ReviewQueueProducer.length ? 'ReviewQueueProducer' : 'ReviewQueueProducer',
  );

  constructor(private readonly processor: ReviewQueueProcessor) {}

  async enqueueReview(
    reviewId: string,
    providerChoice?: string,
  ): Promise<void> {
    this.logger.log(
      `Enqueueing review job for reviewId: ${reviewId} (Provider: ${providerChoice || 'default'})`,
    );

    // Asynchronously trigger queue processing background task
    setImmediate(() => {
      this.processor
        .processJob({ reviewId, providerChoice })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          this.logger.error(
            `Background job processing failed for reviewId ${reviewId}: ${message}`,
          );
        });
    });

    return Promise.resolve();
  }
}
