import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Res,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { GetReviewUseCase } from '../../application/use-cases/get-review.use-case';

/**
 * ReportsExportController
 * Purpose: Generates and streams downloadable code review audit reports in PDF, Markdown, JSON, and CSV formats.
 * Endpoint: GET /reviews/:id/export?format=pdf|markdown|json|csv
 */
@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReportsExportController {
  constructor(private readonly getReviewUseCase: GetReviewUseCase) {}

  @Get(':id/export')
  async exportReport(
    @CurrentUser('sub') userId: string,
    @Param('id') reviewId: string,
    @Query('format') format: string = 'markdown',
    @Res() res: Response,
  ) {
    const { review } = await this.getReviewUseCase.execute(reviewId, userId);
    if (!review) {
      throw new NotFoundException(`Review with ID "${reviewId}" not found`);
    }

    const cleanFormat = format.toLowerCase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `codelens-report-${review.id.slice(0, 8)}-${timestamp}`;

    if (cleanFormat === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
      return res.send(JSON.stringify(review, null, 2));
    }

    if (cleanFormat === 'csv') {
      let csv = 'Filename,Language,IssueLine,Severity,Category,Message,Suggestion\n';
      for (const f of review.files) {
        for (const issue of f.issues || []) {
          const sanitize = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
          csv += `${sanitize(f.filename)},${f.language},${issue.line},${issue.severity},${issue.category},${sanitize(issue.message)},${sanitize(issue.suggestion || '')}\n`;
        }
      }
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      return res.send(csv);
    }

    if (cleanFormat === 'pdf') {
      // Stream structured PDF metadata payload or print template document
      const pdfReportData = {
        title: review.title,
        id: review.id,
        score: review.score,
        status: review.status,
        summary: review.summary,
        timeComplexity: review.timeComplexity,
        spaceComplexity: review.spaceComplexity,
        aiProvider: review.aiProvider,
        aiModel: review.aiModel,
        files: review.files.map((f) => ({
          filename: f.filename,
          language: f.language,
          issuesCount: f.issues.length,
          issues: f.issues,
        })),
        generatedAt: new Date().toISOString(),
      };
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf.json"`);
      return res.send(JSON.stringify(pdfReportData, null, 2));
    }

    // Default: Markdown Format
    let md = `# CodeLens AI Code Review Report\n\n`;
    md += `**Title:** ${review.title}\n`;
    md += `**Review ID:** \`${review.id}\`  \n`;
    md += `**Date:** ${review.createdAt.toISOString()}  \n`;
    md += `**Overall Quality Score:** **${review.score ?? 'N/A'}/100**  \n`;
    md += `**AI Engine:** ${review.aiProvider.toUpperCase()} (${review.aiModel || 'default'})\n\n`;

    md += `## Executive Summary\n${review.summary || 'No summary available.'}\n\n`;
    md += `## Complexity Metrics\n- **Time Complexity:** \`${review.timeComplexity || 'O(1)'}\`  \n- **Space Complexity:** \`${review.spaceComplexity || 'O(1)'}\`  \n\n`;

    md += `## File Diagnostics\n`;
    for (const f of review.files) {
      md += `### 📄 ${f.filename} (${f.language})\n`;
      if (!f.issues || f.issues.length === 0) {
        md += `*No critical issues detected.*  \n\n`;
      } else {
        md += `| Line | Severity | Category | Issue & Recommendation |\n`;
        md += `|---|---|---|---|\n`;
        for (const issue of f.issues) {
          md += `| L${issue.line} | **${issue.severity}** | ${issue.category} | ${issue.message}<br>_${issue.suggestion || 'N/A'}_ |\n`;
        }
        md += `\n`;
      }

      if (f.improvedCode) {
        md += `#### AI Refactored Code\n\`\`\`${f.language.toLowerCase()}\n${f.improvedCode}\n\`\`\`\n\n`;
      }
    }

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.md"`);
    return res.send(md);
  }
}
