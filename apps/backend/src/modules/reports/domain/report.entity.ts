import { ReportFormat } from './report-format.enum';
import { ReportTemplateType } from './report-template-type.enum';
import { ReportStatus } from './report-status.enum';
import { IReportContent } from './report-content.interface';

export class ReportEntity {
  constructor(
    public readonly id: string,
    public readonly reviewId: string,
    public readonly creatorId: string,
    public readonly title: string,
    public readonly format: ReportFormat,
    public readonly templateType: ReportTemplateType,
    public readonly status: ReportStatus,
    public readonly version: number,
    public readonly content: IReportContent,
    public readonly downloadCount: number,
    public readonly fileUrl?: string | null,
    public readonly fileSize?: number | null,
    public readonly expiresAt?: Date | null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly deletedAt?: Date | null,
  ) {}

  public isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  public isDeleted(): boolean {
    return !!this.deletedAt;
  }

  public isReady(): boolean {
    return this.status === ReportStatus.COMPLETED;
  }
}
