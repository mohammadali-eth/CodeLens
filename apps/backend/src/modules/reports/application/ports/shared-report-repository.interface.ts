import { SharedReportEntity } from '../../domain/shared-report.entity';

export const SHARED_REPORT_REPOSITORY = Symbol('SHARED_REPORT_REPOSITORY');

export interface CreateSharedReportData {
  reportId: string;
  token: string;
  expiresAt: Date;
  createdById: string;
}

export interface ISharedReportRepository {
  create(data: CreateSharedReportData): Promise<SharedReportEntity>;
  findByToken(token: string): Promise<SharedReportEntity | null>;
  findByReportId(reportId: string): Promise<SharedReportEntity[]>;
  incrementAccessCount(token: string): Promise<void>;
  revokeToken(token: string): Promise<void>;
}
