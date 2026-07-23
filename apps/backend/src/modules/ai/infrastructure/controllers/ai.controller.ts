import { Controller, Post, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { AnalyzeCodeReviewUseCase } from '../../application/use-cases/analyze-code-review.use-case';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AIController {
  constructor(
    private readonly analyzeCodeReviewUseCase: AnalyzeCodeReviewUseCase,
  ) {}

  @Post('analyze/:reviewId')
  async analyze(
    @Param('reviewId') reviewId: string,
    @Query('provider') provider?: string,
  ) {
    return this.analyzeCodeReviewUseCase.execute(reviewId, provider);
  }
}
