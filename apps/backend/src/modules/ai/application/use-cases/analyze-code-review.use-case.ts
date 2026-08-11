import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IReviewRepository } from '../../../review/application/ports/review-repository.interface';
import { AIService } from '../ai.service';
import { Review } from '../../../review/domain/review.entity';
import {
  ReviewFile,
  CodeIssue,
} from '../../../review/domain/review-file.entity';
import { CodeIssuePayload } from '../../domain/unified-ai-response.interface';
import { ReviewEventsGateway } from '../../infrastructure/websockets/review-events.gateway';
import { ReviewStatus } from '../../../review/domain/review-status.enum';

@Injectable()
export class AnalyzeCodeReviewUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
    private readonly aiService: AIService,
    private readonly eventsGateway: ReviewEventsGateway,
  ) {}

  async execute(reviewId: string, providerChoice?: string): Promise<Review> {
    const startTime = Date.now();
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException(`Review with ID "${reviewId}" was not found`);
    }

    // 1. Emit Queued / Processing start event
    this.eventsGateway.emitStatusUpdate({
      reviewId,
      status: ReviewStatus.PROCESSING,
      progress: 25,
      message: 'Initializing AI Static Analysis Pipeline...',
    });

    const processingReview = review.markProcessing();
    await this.reviewRepository.update(processingReview);

    try {
      this.eventsGateway.emitStatusUpdate({
        reviewId,
        status: ReviewStatus.PROCESSING,
        progress: 50,
        message: 'Executing multi-provider LLM inspection...',
      });

      // 2. Run AI Engine pipeline
      const aiResponse = await this.aiService.analyzeCode(
        processingReview.files.map((f) => ({
          filename: f.filename,
          content: f.content,
          language: f.language,
        })),
        {
          preferredProvider: providerChoice || processingReview.aiProvider,
          model: processingReview.aiModel || undefined,
        },
      );

      this.eventsGateway.emitStatusUpdate({
        reviewId,
        status: ReviewStatus.PROCESSING,
        progress: 85,
        message: 'Normalizing issues and saving results...',
      });

      // 3. Combine all issues
      const allRawIssues: CodeIssuePayload[] = [
        ...aiResponse.bugs,
        ...aiResponse.errors,
        ...aiResponse.bestPractices,
        ...aiResponse.optimizations,
        ...aiResponse.cleanCodeSuggestions,
      ];

      const totalFiles = processingReview.files.length;

      const updatedFiles: ReviewFile[] = processingReview.files.map((file) => {
        const fileIssues: CodeIssue[] = allRawIssues
          .filter((issue) => {
            if (totalFiles === 1) return true;
            if (!issue.filename) return true;
            if (issue.filename === file.filename) return true;
            const issueBase = issue.filename.split('/').pop();
            const fileBase = file.filename.split('/').pop();
            return issueBase === fileBase;
          })
          .map((issue) => ({
            id: randomUUID(),
            line: issue.line || 1,
            severity: issue.severity,
            category: issue.category,
            message: issue.message,
            suggestion: issue.suggestion,
          }));

        let updatedFile = file;
        for (const issue of fileIssues) {
          updatedFile = updatedFile.addIssue(issue);
        }

        if (aiResponse.improvedCode && aiResponse.improvedCode[file.filename]) {
          updatedFile = updatedFile.withImprovedCode(
            aiResponse.improvedCode[file.filename],
          );
        }

        return updatedFile;
      });

      const duration = Date.now() - startTime;

      const completedReview = processingReview.completeAnalysis(
        aiResponse.summary,
        aiResponse.qualityScore,
        aiResponse.timeComplexity,
        aiResponse.spaceComplexity,
        duration,
        updatedFiles,
        {
          aiModel: aiResponse.model,
          explanation: aiResponse.explanation,
          confidenceScore: aiResponse.confidenceScore,
          promptVersion: aiResponse.promptVersion,
          promptTokens: aiResponse.tokenUsage?.promptTokens || 0,
          completionTokens: aiResponse.tokenUsage?.completionTokens || 0,
          totalTokens: aiResponse.tokenUsage?.totalTokens || 0,
          rawResponse: aiResponse.rawResponse,
        },
      );

      const savedReview = await this.reviewRepository.update(completedReview);

      // 4. Emit Completed event
      this.eventsGateway.emitStatusUpdate({
        reviewId,
        status: ReviewStatus.COMPLETED,
        progress: 100,
        message: 'Code Review Completed Successfully',
        payload: {
          score: savedReview.score,
          summary: savedReview.summary,
          totalIssues: savedReview.getTotalIssuesCount(),
        },
      });

      return savedReview;
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      const failedReview = processingReview.failAnalysis(errMessage);
      await this.reviewRepository.update(failedReview);

      this.eventsGateway.emitStatusUpdate({
        reviewId,
        status: ReviewStatus.FAILED,
        progress: 100,
        message: `Code Review Failed: ${errMessage}`,
      });

      throw error;
    }
  }
}
