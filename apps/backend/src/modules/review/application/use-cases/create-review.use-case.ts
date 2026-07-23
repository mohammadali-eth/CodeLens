import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IReviewRepository } from '../ports/review-repository.interface';
import { ICodeParserService } from '../ports/code-parser.interface';
import { Review } from '../../domain/review.entity';
import { CodeFile } from '../../domain/code-file.entity';
import { CreateReviewDto } from '../../infrastructure/controllers/dtos/create-review.dto';

@Injectable()
export class CreateReviewUseCase {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
    @Inject(ICodeParserService)
    private readonly codeParserService: ICodeParserService,
  ) {}

  async execute(dto: CreateReviewDto, creatorId: string): Promise<Review> {
    if (!dto.files || dto.files.length === 0) {
      throw new BadRequestException('At least one code file must be submitted for review');
    }

    const reviewId = crypto.randomUUID();

    const codeFiles: CodeFile[] = dto.files.map((f) => {
      const fileId = crypto.randomUUID();
      const metadata = this.codeParserService.parse(f.filename, f.content);
      return CodeFile.create(
        fileId,
        reviewId,
        f.filename,
        f.content,
        metadata.language,
        [],
      );
    });

    const review = Review.create(
      reviewId,
      dto.title,
      dto.repository,
      dto.branch || 'main',
      creatorId,
      codeFiles,
    );

    return this.reviewRepository.save(review);
  }
}
