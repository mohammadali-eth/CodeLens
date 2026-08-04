import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { CreateReviewUseCase } from '../../application/use-cases/create-review.use-case';
import { GetReviewUseCase } from '../../application/use-cases/get-review.use-case';
import { randomUUID } from 'crypto';

interface WorkspaceProjectDto {
  name: string;
  description?: string;
  repository?: string;
  branch?: string;
  files?: Array<{ filename: string; content: string; language?: string }>;
}

/**
 * ProjectsController
 * Purpose: Exposes project session endpoints for workspace management and file upload ingestion.
 * Endpoints:
 *  - POST /projects
 *  - GET /projects/:id
 *  - POST /files/upload
 *  - GET /files/:id
 */
@Controller()
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly getReviewUseCase: GetReviewUseCase,
  ) {}

  @Post('projects')
  @HttpCode(HttpStatus.CREATED)
  async createProject(
    @CurrentUser('sub') userId: string,
    @Body() dto: WorkspaceProjectDto,
  ) {
    const projectId = randomUUID();
    const files = dto.files && dto.files.length > 0 ? dto.files : [
      {
        filename: 'main.ts',
        content: `// CodeLens Workspace Session: ${dto.name || 'New Project'}\nconsole.log("Initialized workspace project");\n`,
        language: 'TYPESCRIPT',
      },
    ];

    // Create an initial review record for the workspace project
    const review = await this.createReviewUseCase.execute(
      {
        title: dto.name || 'Workspace Project Review',
        description: dto.description || 'Interactive Cloud IDE workspace project',
        repository: dto.repository,
        branch: dto.branch || 'main',
        files,
      },
      userId,
    );

    return {
      id: projectId,
      reviewId: review.id,
      name: dto.name || 'Untitled Workspace Project',
      files: review.files,
      createdAt: new Date().toISOString(),
    };
  }

  @Get('projects/:id')
  async getProject(
    @CurrentUser('sub') userId: string,
    @Param('id') projectId: string,
  ) {
    // Return mock or fetched project aggregate
    return {
      id: projectId,
      name: 'CodeLens Workspace Project',
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    };
  }

  @Post('files/upload')
  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(HttpStatus.CREATED)
  async uploadFiles(
    @CurrentUser('sub') userId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('title') title?: string,
    @Body('aiProvider') aiProvider?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const parsedFiles = files.map((f) => ({
      filename: f.originalname,
      content: f.buffer.toString('utf-8'),
    }));

    const review = await this.createReviewUseCase.execute(
      {
        title: title || `Upload Review (${files.length} files)`,
        aiProvider: aiProvider || 'gemini',
        files: parsedFiles,
      },
      userId,
    );

    return {
      message: 'Files uploaded successfully',
      reviewId: review.id,
      filesCount: files.length,
      files: review.files,
    };
  }

  @Get('files/:id')
  async getFile(
    @CurrentUser('sub') userId: string,
    @Param('id') fileId: string,
  ) {
    return {
      id: fileId,
      filename: 'main.ts',
      content: '// File content fetched',
      language: 'TYPESCRIPT',
    };
  }
}
