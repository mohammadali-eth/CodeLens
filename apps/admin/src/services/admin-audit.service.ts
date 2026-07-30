import { apiClient } from '../core/api/api-client';
import { loggerService } from '../core/services/logger.service';

export interface AuditLogPayload {
  action: string;
  category: 'REVIEW_MANAGEMENT' | 'USER_MANAGEMENT' | 'SECURITY' | 'SYSTEM';
  details: string;
  targetId?: string;
  metadata?: Record<string, any>;
}

export class AdminAuditService {
  private static instance: AdminAuditService;

  private constructor() {}

  public static getInstance(): AdminAuditService {
    if (!AdminAuditService.instance) {
      AdminAuditService.instance = new AdminAuditService();
    }
    return AdminAuditService.instance;
  }

  public async logAction(payload: AuditLogPayload): Promise<boolean> {
    try {
      loggerService.info(`[AuditLog] ${payload.action}: ${payload.details}`, payload);
      await apiClient.post('/admin/audit-logs', {
        action: payload.action,
        category: payload.category,
        details: payload.details,
        targetId: payload.targetId,
        metadata: payload.metadata,
        timestamp: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      loggerService.warn(`[AuditLog Fallback] Could not persist audit log to backend server.`, error);
      return false;
    }
  }
}

export const adminAuditService = AdminAuditService.getInstance();
