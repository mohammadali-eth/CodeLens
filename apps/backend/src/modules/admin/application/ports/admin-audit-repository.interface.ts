import { AdminAuditLogEntity } from '../../domain/admin-audit-log.entity';

export const ADMIN_AUDIT_REPOSITORY = Symbol('ADMIN_AUDIT_REPOSITORY');

export interface AuditLogQueryOptions {
  userId?: string;
  action?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAuditLogsResult {
  logs: AdminAuditLogEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateAuditLogData {
  userId?: string;
  userEmail?: string;
  action: string;
  resource?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface IAdminAuditRepository {
  create(data: CreateAuditLogData): Promise<AdminAuditLogEntity>;
  findAll(options: AuditLogQueryOptions): Promise<PaginatedAuditLogsResult>;
}
