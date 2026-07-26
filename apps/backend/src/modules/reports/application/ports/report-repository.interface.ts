import { ReportEntity } from '../../domain/report.entity';
import { ReportFormat } from '../../domain/report-format.enum';
import { ReportTemplateType } from '../../domain/report-template-type.enum';

export const REPORT_REPOSITORY = Symbol('REPORT_REPOSITORY');

export interface CreateReportData {
  reviewId: string;
  creatorId: string;
  title: string;
  format: ReportFormat;
  templateType: ReportTemplateType;
  content: any;
  fileUrl?: string;
  fileSize?: number;
  expiresAt?: Date;
}

export interface IReportRepository {
  create(data: CreateReportData): Promise<ReportEntity>;
  findById(id: string): Promise<ReportEntity | null>;
  findByReviewIdAndFormat(reviewId: string, format: ReportFormat, templateType?: ReportTemplateType): Promise<ReportEntity | null>;
  findUserReports(userId: string, limit?: number, offset?: number): Promise<{ reports: ReportEntity[]; total: number }>;
  incrementDownloadCount(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  updateContent(id: string, content: any, fileUrl?: string, fileSize?: number): Promise<ReportEntity>;
}
