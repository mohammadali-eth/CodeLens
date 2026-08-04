import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { PrismaService } from '../../../database/prisma.service';
import { CreateReviewUseCase } from '../../application/use-cases/create-review.use-case';
import { ProgrammingLanguage } from '@prisma/client';

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  repository?: string;
  branch?: string;
  files?: Array<{ filename: string; path?: string; content: string; language?: string }>;
}

/**
 * WorkspacesController
 * Purpose: Full REST API implementation for persistent enterprise Workspaces, project sessions, and file management.
 * Endpoints:
 *  - POST /workspaces
 *  - GET /workspaces
 *  - GET /workspaces/:id
 *  - POST /workspaces/:id/files
 *  - DELETE /workspaces/:id/files/:fileId
 *  - DELETE /workspaces/:id
 */
@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly createReviewUseCase: CreateReviewUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWorkspace(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateWorkspaceDto,
  ) {
    const workspace = await this.prisma.workspace.create({
      data: {
        name: dto.name || 'New AI Code Review Workspace',
        description: dto.description || 'Enterprise Cloud IDE workspace session',
        repository: dto.repository,
        branch: dto.branch || 'main',
        userId,
        files: {
          create: (dto.files || []).map((f) => ({
            filename: f.filename,
            path: f.path || f.filename,
            content: f.content,
            language: this.mapLanguage(f.language || f.filename),
            fileSize: f.content.length,
          })),
        },
      },
      include: {
        files: true,
      },
    });

    return workspace;
  }

  @Get()
  async listWorkspaces(@CurrentUser('sub') userId: string) {
    return this.prisma.workspace.findMany({
      where: { userId },
      include: {
        files: {
          select: { id: true, filename: true, path: true, language: true, fileSize: true, updatedAt: true },
        },
        reviews: {
          select: { id: true, title: true, status: true, score: true, createdAt: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  @Get(':id')
  async getWorkspace(
    @CurrentUser('sub') userId: string,
    @Param('id') workspaceId: string,
  ) {
    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, userId },
      include: {
        files: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID "${workspaceId}" was not found`);
    }

    return workspace;
  }

  @Post(':id/files')
  @HttpCode(HttpStatus.OK)
  async updateWorkspaceFiles(
    @CurrentUser('sub') userId: string,
    @Param('id') workspaceId: string,
    @Body('files') files: Array<{ filename: string; path?: string; content: string; language?: string }>,
  ) {
    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, userId },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace not found`);
    }

    // Upsert files
    for (const f of files || []) {
      const existing = await this.prisma.workspaceFile.findFirst({
        where: { workspaceId, path: f.path || f.filename },
      });

      if (existing) {
        await this.prisma.workspaceFile.update({
          where: { id: existing.id },
          data: {
            content: f.content,
            fileSize: f.content.length,
            language: this.mapLanguage(f.language || f.filename),
          },
        });
      } else {
        await this.prisma.workspaceFile.create({
          data: {
            workspaceId,
            filename: f.filename,
            path: f.path || f.filename,
            content: f.content,
            language: this.mapLanguage(f.language || f.filename),
            fileSize: f.content.length,
          },
        });
      }
    }

    return this.getWorkspace(userId, workspaceId);
  }

  @Delete(':id/files/:fileId')
  @HttpCode(HttpStatus.OK)
  async deleteWorkspaceFile(
    @CurrentUser('sub') userId: string,
    @Param('id') workspaceId: string,
    @Param('fileId') fileId: string,
  ) {
    await this.prisma.workspaceFile.deleteMany({
      where: { id: fileId, workspaceId },
    });

    return { message: 'Workspace file deleted successfully' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteWorkspace(
    @CurrentUser('sub') userId: string,
    @Param('id') workspaceId: string,
  ) {
    await this.prisma.workspace.deleteMany({
      where: { id: workspaceId, userId },
    });

    return { message: 'Workspace session deleted successfully' };
  }

  private mapLanguage(langOrFilename: string): ProgrammingLanguage {
    const l = (langOrFilename || '').toLowerCase();
    if (l.endsWith('.java') || l === 'java') return ProgrammingLanguage.JAVA;
    if (l.endsWith('.js') || l.endsWith('.jsx') || l === 'javascript') return ProgrammingLanguage.JAVASCRIPT;
    if (l.endsWith('.py') || l === 'python') return ProgrammingLanguage.PYTHON;
    if (l.endsWith('.go') || l === 'go') return ProgrammingLanguage.GO;
    if (l.endsWith('.rs') || l === 'rust') return ProgrammingLanguage.RUST;
    if (l.endsWith('.php') || l === 'php') return ProgrammingLanguage.PHP;
    if (l.endsWith('.cpp') || l.endsWith('.c') || l === 'cpp') return ProgrammingLanguage.CPP;
    if (l.endsWith('.cs') || l === 'csharp') return ProgrammingLanguage.CSHARP;
    return ProgrammingLanguage.TYPESCRIPT;
  }
}
