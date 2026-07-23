import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { IReviewRepository } from './application/ports/review-repository.interface';
import { ICodeParserService } from './application/ports/code-parser.interface';
import { CreateReviewUseCase } from './application/use-cases/create-review.use-case';
import { GetReviewByIdUseCase } from './application/use-cases/get-review-by-id.use-case';
import { ListReviewsUseCase } from './application/use-cases/list-reviews.use-case';
import { PrismaReviewRepository } from './infrastructure/adapters/prisma-review-repository';
import { SimpleCodeParserService } from './infrastructure/adapters/simple-code-parser.service';
import { ReviewController } from './infrastructure/controllers/review.controller';

@Module({
  imports: [AuthModule],
  controllers: [ReviewController],
  providers: [
    CreateReviewUseCase,
    GetReviewByIdUseCase,
    ListReviewsUseCase,
    {
      provide: IReviewRepository,
      useClass: PrismaReviewRepository,
    },
    {
      provide: ICodeParserService,
      useClass: SimpleCodeParserService,
    },
  ],
  exports: [
    CreateReviewUseCase,
    GetReviewByIdUseCase,
    ListReviewsUseCase,
    IReviewRepository,
    ICodeParserService,
  ],
})
export class ReviewModule {}
