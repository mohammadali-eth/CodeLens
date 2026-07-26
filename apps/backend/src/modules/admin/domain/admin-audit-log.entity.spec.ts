import { AdminAuditLogEntity } from './admin-audit-log.entity';

describe('AdminAuditLogEntity', () => {
  it('should instantiate immutable audit log entries', () => {
    const auditLog = new AdminAuditLogEntity(
      'log-1',
      'ADMIN_USER_ROLE_UPDATE',
      'user-admin-1',
      'admin@codelens.io',
      'users:target-user-2',
      '192.168.1.1',
      'Mozilla/5.0',
      { oldRole: 'USER', newRole: 'ADMIN' },
    );

    expect(auditLog.id).toBe('log-1');
    expect(auditLog.action).toBe('ADMIN_USER_ROLE_UPDATE');
    expect(auditLog.userId).toBe('user-admin-1');
    expect(auditLog.userEmail).toBe('admin@codelens.io');
    expect(auditLog.resource).toBe('users:target-user-2');
    expect(auditLog.ipAddress).toBe('192.168.1.1');
    expect(auditLog.userAgent).toBe('Mozilla/5.0');
    expect(auditLog.metadata).toEqual({ oldRole: 'USER', newRole: 'ADMIN' });
    expect(auditLog.createdAt).toBeInstanceOf(Date);
  });
});
