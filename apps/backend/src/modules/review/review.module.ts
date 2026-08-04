import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { AIModule } from '../ai/ai.module';
import { ReviewController } from './infrastructure/controllers/review.controller';
import { AdminReviewsController } from './infrastructure/controllers/admin-reviews.controller';
import { ProjectsController } from './infrastructure/controllers/projects.controller';
import { WorkspacesController } from './infrastructure/controllers/workspaces.controller';
import { ReportsExportController } from './infrastructure/controllers/reports-export.controller';
import { CreateReviewUseCase } from './application/use-cases/create-review.use-case';
import { GetReviewUseCase } from './application/use-cases/get-review.use-case';
import { ListReviewsUseCase } from './application/use-cases/list-reviews.use-case';
import { DeleteReviewUseCase } from './application/use-cases/delete-review.use-case';
import { FavoriteReviewUseCase } from './application/use-cases/favorite-review.use-case';
import { RerunReviewUseCase } from './application/use-cases/rerun-review.use-case';
import { IReviewRepository } from './application/ports/review-repository.interface';
import { PrismaReviewRepository } from './infrastructure/adapters/prisma-review-repository';

@Module({
  imports: [AuthModule, DatabaseModule, forwardRef(() => AIModule)],
  controllers: [ReviewController, AdminReviewsController, ProjectsController],
  providers: [
    CreateReviewUseCase,
    GetReviewUseCase,
    ListReviewsUseCase,
    DeleteReviewUseCase,
    FavoriteReviewUseCase,
    RerunReviewUseCase,
    {
      provide: IReviewRepository,
      useClass: PrismaReviewRepository,
    },
  ],
  exports: [
    CreateReviewUseCase,
    GetReviewUseCase,
    ListReviewsUseCase,
    DeleteReviewUseCase,
    FavoriteReviewUseCase,
    RerunReviewUseCase,
    IReviewRepository,
  ],
})
export class ReviewModule {}
