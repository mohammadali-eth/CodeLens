import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { CreateReviewUseCase } from '../../application/use-cases/create-review.use-case';
import { GetReviewUseCase } from '../../application/use-cases/get-review.use-case';
import { ListReviewsUseCase } from '../../application/use-cases/list-reviews.use-case';
import { DeleteReviewUseCase } from '../../application/use-cases/delete-review.use-case';
import { FavoriteReviewUseCase } from '../../application/use-cases/favorite-review.use-case';
import { RerunReviewUseCase } from '../../application/use-cases/rerun-review.use-case';
import { CreateReviewDto } from './dtos/create-review.dto';

/**
 * ReviewController
 * Purpose: REST API Controller for Code Review lifecycle operations.
 * Responsibilities: Handles review submissions, listing, fetching, re-analysis, soft-deletion, and bookmarking.
 * Dependencies: JwtAuthGuard, Use Cases.
 */
@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly getReviewUseCase: GetReviewUseCase,
    private readonly listReviewsUseCase: ListReviewsUseCase,
    private readonly deleteReviewUseCase: DeleteReviewUseCase,
    private readonly favoriteReviewUseCase: FavoriteReviewUseCase,
    private readonly rerunReviewUseCase: RerunReviewUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReview(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.createReviewUseCase.execute(dto, userId);
  }

  @Get()
  async listReviews(
    @CurrentUser('sub') userId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const skipNum = skip ? parseInt(skip, 10) : 0;
    const takeNum = take ? parseInt(take, 10) : 20;
    return this.listReviewsUseCase.execute(userId, skipNum, takeNum);
  }

  @Get(':id')
  async getReview(
    @CurrentUser('sub') userId: string,
    @Param('id') reviewId: string,
  ) {
    return this.getReviewUseCase.execute(reviewId, userId);
  }

  @Patch(':id/rerun')
  async rerunReview(
    @CurrentUser('sub') userId: string,
    @Param('id') reviewId: string,
    @Body('aiProvider') aiProvider?: string,
  ) {
    return this.rerunReviewUseCase.execute(reviewId, userId, aiProvider);
  }

  @Get(':id/report')
  async downloadReport(
    @CurrentUser('sub') userId: string,
    @Param('id') reviewId: string,
  ) {
    const { review, isFavorited } = await this.getReviewUseCase.execute(
      reviewId,
      userId,
    );
    return {
      reportId: `REP-${review.id}`,
      generatedAt: new Date().toISOString(),
      reviewId: review.id,
      title: review.title,
      score: review.score,
      status: review.status,
      summary: review.summary,
      timeComplexity: review.timeComplexity,
      spaceComplexity: review.spaceComplexity,
      aiProvider: review.aiProvider,
      aiModel: review.aiModel,
      isFavorited,
      totalFiles: review.files.length,
      totalIssues: review.getTotalIssuesCount(),
      criticalIssues: review.getCriticalIssuesCount(),
      files: review.files.map((f) => ({
        filename: f.filename,
        language: f.language,
        issues: f.issues,
        improvedCode: f.improvedCode,
      })),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteReview(
    @CurrentUser('sub') userId: string,
    @Param('id') reviewId: string,
  ) {
    await this.deleteReviewUseCase.execute(reviewId, userId);
    return { message: 'Review deleted successfully' };
  }

  @Post(':id/favorite')
  @HttpCode(HttpStatus.OK)
  async favoriteReview(
    @CurrentUser('sub') userId: string,
    @Param('id') reviewId: string,
  ) {
    await this.favoriteReviewUseCase.favorite(reviewId, userId);
    return { message: 'Review added to favorites' };
  }

  @Delete(':id/favorite')
  @HttpCode(HttpStatus.OK)
  async unfavoriteReview(
    @CurrentUser('sub') userId: string,
    @Param('id') reviewId: string,
  ) {
    await this.favoriteReviewUseCase.unfavorite(reviewId, userId);
    return { message: 'Review removed from favorites' };
  }
}
