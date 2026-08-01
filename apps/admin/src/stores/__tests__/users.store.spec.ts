import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUsersStore } from '../users.store';
import { adminUsersService } from '../../services/admin-users.service';

vi.mock('../../services/admin-users.service', () => ({
  adminUsersService: {
    getUsers: vi.fn().mockResolvedValue({
      users: [
        {
          id: 'usr_101',
          email: 'admin@codelens.ai',
          username: 'admin',
          firstName: 'CodeLens',
          lastName: 'Administrator',
          role: 'SUPER_ADMIN',
          status: 'ACTIVE',
          isEmailVerified: true,
          department: 'Platform Engineering',
          createdAt: new Date().toISOString(),
          reviewsCount: 42,
          chatsCount: 15,
          reportsCount: 5,
        },
        {
          id: 'usr_102',
          email: 'dev@codelens.ai',
          username: 'dev_user',
          firstName: 'Alice',
          lastName: 'Engineer',
          role: 'USER',
          status: 'ACTIVE',
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
          reviewsCount: 12,
          chatsCount: 3,
          reportsCount: 1,
        },
      ],
      total: 2,
      page: 1,
      pageSize: 25,
      totalPages: 1,
    }),
    getUserById: vi.fn().mockResolvedValue({
      id: 'usr_101',
      email: 'admin@codelens.ai',
      username: 'admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      reviewsCount: 42,
      chatsCount: 15,
      reportsCount: 5,
    }),
    updateUserStatus: vi.fn().mockResolvedValue({
      id: 'usr_102',
      email: 'dev@codelens.ai',
      username: 'dev_user',
      role: 'USER',
      status: 'SUSPENDED',
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      reviewsCount: 12,
      chatsCount: 3,
      reportsCount: 1,
    }),
    updateUser: vi.fn().mockResolvedValue({
      success: true,
      user: {
        id: 'usr_102',
        email: 'dev@codelens.ai',
        username: 'dev_user',
        role: 'ADMIN',
        status: 'ACTIVE',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        reviewsCount: 12,
        chatsCount: 3,
        reportsCount: 1,
      },
    }),
    getUserAuditLogs: vi.fn().mockResolvedValue([
      {
        id: 'log_1',
        userId: 'usr_101',
        action: 'USER_LOGIN_SUCCESS',
        details: 'User authenticated successfully',
        createdAt: new Date().toISOString(),
      },
    ]),
    getUserSessions: vi.fn().mockResolvedValue([
      {
        id: 'sess_1',
        userId: 'usr_101',
        device: 'MacBook Pro 16"',
        browser: 'Chrome 122',
        ipAddress: '192.168.1.1',
        lastActiveAt: new Date().toISOString(),
        isCurrent: true,
      },
    ]),
    deleteUser: vi.fn().mockResolvedValue({
      success: true,
      id: 'usr_102',
    }),
    executeBulkAction: vi.fn().mockResolvedValue({
      success: true,
      affectedCount: 2,
      message: 'Bulk operation successful',
    }),
  },
}));

describe('useUsersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    const store = useUsersStore();
    expect(store.users).toEqual([]);
    expect(store.selectedUser).toBeNull();
    expect(store.selectedUsersCount).toBe(0);
    expect(store.filters.page).toBe(1);
    expect(store.filters.pageSize).toBe(10);
  });

  it('fetches users list and updates stats', async () => {
    const store = useUsersStore();
    await store.fetchUsers();

    expect(adminUsersService.getUsers).toHaveBeenCalledWith(store.filters);
    expect(store.users.length).toBe(2);
    expect(store.totalUsers).toBe(2);
    expect(store.userStats.total).toBe(2);
    expect(store.userStats.active).toBe(2);
  });

  it('handles user row selection and select all toggle', async () => {
    const store = useUsersStore();
    await store.fetchUsers();

    store.toggleUserSelection('usr_101');
    expect(store.selectedUsersCount).toBe(1);
    expect(store.hasSelectedUsers).toBe(true);

    store.toggleSelectAll();
    expect(store.isAllSelected).toBe(true);
    expect(store.selectedUsersCount).toBe(2);

    store.clearSelection();
    expect(store.selectedUsersCount).toBe(0);
    expect(store.hasSelectedUsers).toBe(false);
  });

  it('fetches user profile drawer details by ID', async () => {
    const store = useUsersStore();
    await store.fetchUserById('usr_101');

    expect(adminUsersService.getUserById).toHaveBeenCalledWith('usr_101');
    expect(store.selectedUser?.id).toBe('usr_101');
    expect(store.userSessions.length).toBe(1);
    expect(store.userAuditLogs.length).toBe(1);
  });

  it('updates user status reactively', async () => {
    const store = useUsersStore();
    await store.fetchUsers();

    await store.updateUserStatus('usr_102', 'SUSPENDED');
    expect(adminUsersService.updateUserStatus).toHaveBeenCalledWith('usr_102', 'SUSPENDED');
    const updated = store.users.find((u) => u.id === 'usr_102');
    expect(updated?.status).toBe('SUSPENDED');
  });

  it('executes bulk action across selected users', async () => {
    const store = useUsersStore();
    await store.fetchUsers();
    store.toggleSelectAll();

    await store.executeBulkAction('suspend', 'Security audit');
    expect(adminUsersService.executeBulkAction).toHaveBeenCalledWith({
      action: 'suspend',
      userIds: ['usr_101', 'usr_102'],
      reason: 'Security audit',
    });
    expect(store.selectedUsersCount).toBe(0);
  });
});
