import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Inject,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { FileValidationPipe } from '../pipes/file-validation.pipe';
import { IStorageService } from '../../application/ports/storage-service.interface';
import { CreateReviewUseCase } from '../../../review/application/use-cases/create-review.use-case';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(
    @Inject(IStorageService)
    private readonly storageService: IStorageService,
    private readonly createReviewUseCase: CreateReviewUseCase,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadCodeFile(
    @CurrentUser('sub') userId: string,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Body('title') title?: string,
    @Body('aiProvider') aiProvider?: string,
  ) {
    // 1. Upload raw source file to storage adapter
    const storedResult = await this.storageService.uploadFile(
      file,
      'code-reviews',
    );

    // 2. Decode source file text content
    const fileContent = file.buffer.toString('utf-8');

    // 3. Delegate to CreateReviewUseCase
    const review = await this.createReviewUseCase.execute(
      {
        title: title || file.originalname,
        aiProvider: aiProvider || 'gemini',
        files: [
          {
            filename: file.originalname,
            content: fileContent,
          },
        ],
      },
      userId,
    );

    return {
      review,
      storage: storedResult,
    };
  }
}
