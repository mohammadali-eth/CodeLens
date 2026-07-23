import { Controller, Post, Get, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateReviewUseCase } from '../../application/use-cases/create-review.use-case';
import { GetReviewByIdUseCase } from '../../application/use-cases/get-review-by-id.use-case';
import { ListReviewsUseCase } from '../../application/use-cases/list-reviews.use-case';
import { CreateReviewDto } from './dtos/create-review.dto';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly getReviewByIdUseCase: GetReviewByIdUseCase,
    private readonly listReviewsUseCase: ListReviewsUseCase,
  ) {}

  @Post()
  async createReview(@Body() dto: CreateReviewDto, @Request() req: any) {
    const userId = req.user.sub;
    return this.createReviewUseCase.execute(dto, userId);
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    return this.getReviewByIdUseCase.execute(id);
  }

  @Get()
  async listReviews(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.sub;
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.listReviewsUseCase.execute(userId, pageNum, limitNum);
  }
}
