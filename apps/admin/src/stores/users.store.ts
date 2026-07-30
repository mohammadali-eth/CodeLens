import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import {
  ManagedUser,
  UserQueryFilter,
  UserStatus,
  UserRole,
  BulkUserActionType,
  UserAuditLogItem,
  UserSessionItem,
} from '../models';
import { adminUsersService } from '../services/admin-users.service';

/**
 * Users Store
 * Purpose: Centralized Pinia state management store for Admin User Management lifecycle.
 * Responsibilities: Manages user list, server-side pagination, filters, drawer selection, multi-select set, and bulk actions.
 * Dependencies: adminUsersService, User Management domain models.
 */
export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref<ManagedUser[]>([]);
  const selectedUser = ref<ManagedUser | null>(null);
  const selectedUserIds = ref<Set<string>>(new Set());
  
  const filters = reactive<UserQueryFilter>({
    search: '',
    role: 'ALL',
    status: 'ALL',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    pageSize: 10,
  });

  const totalUsers = ref<number>(0);
  const totalPages = ref<number>(1);

  const userAuditLogs = ref<UserAuditLogItem[]>([]);
  const userSessions = ref<UserSessionItem[]>([]);

  const isLoading = ref<boolean>(false);
  const isActionLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Getters
  const hasSelectedUsers = computed(() => selectedUserIds.value.size > 0);
  const selectedUsersCount = computed(() => selectedUserIds.value.size);
  
  const isAllSelected = computed(() => {
    if (users.value.length === 0) return false;
    return users.value.every((u) => selectedUserIds.value.has(u.id));
  });

  const userStats = computed(() => {
    let active = 0;
    let suspended = 0;
    let pending = 0;

    users.value.forEach((u) => {
      if (u.status === 'ACTIVE') active++;
      else if (u.status === 'SUSPENDED') suspended++;
      else if (u.status === 'PENDING' || u.status === 'UNVERIFIED') pending++;
    });

    return {
      total: totalUsers.value || users.value.length,
      active,
      suspended,
      pending,
    };
  });

  // Actions
  async function fetchUsers(resetPage = false) {
    if (resetPage) filters.page = 1;
    isLoading.value = true;
    error.value = null;

    try {
      const response = await adminUsersService.getUsers(filters);
      users.value = response.users;
      totalUsers.value = response.total;
      totalPages.value = response.totalPages;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch platform users.';
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUserById(id: string) {
    isActionLoading.value = true;
    error.value = null;

    try {
      const user = await adminUsersService.getUserById(id);
      selectedUser.value = user;
      await Promise.all([fetchUserAuditLogs(id), fetchUserSessions(id)]);
    } catch (err: any) {
      error.value = err.message || `Failed to fetch profile for user ${id}.`;
    } finally {
      isActionLoading.value = false;
    }
  }

  async function updateUserStatus(id: string, status: UserStatus) {
    isActionLoading.value = true;
    error.value = null;

    try {
      const updated = await adminUsersService.updateUserStatus(id, status);
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], status: updated.status };
      }
      if (selectedUser.value && selectedUser.value.id === id) {
        selectedUser.value.status = updated.status;
      }
      return updated;
    } catch (err: any) {
      error.value = err.message || 'Failed to update user status.';
      throw err;
    } finally {
      isActionLoading.value = false;
    }
  }

  async function updateUser(id: string, payload: Partial<ManagedUser>) {
    isActionLoading.value = true;
    error.value = null;

    try {
      const updated = await adminUsersService.updateUser(id, payload);
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...updated };
      }
      if (selectedUser.value && selectedUser.value.id === id) {
        selectedUser.value = { ...selectedUser.value, ...updated };
      }
      return updated;
    } catch (err: any) {
      error.value = err.message || 'Failed to update user profile.';
      throw err;
    } finally {
      isActionLoading.value = false;
    }
  }

  async function deleteUser(id: string) {
    isActionLoading.value = true;
    error.value = null;

    try {
      const success = await adminUsersService.deleteUser(id);
      if (success) {
        users.value = users.value.filter((u) => u.id !== id);
        selectedUserIds.value.delete(id);
        if (selectedUser.value?.id === id) {
          selectedUser.value = null;
        }
        totalUsers.value = Math.max(0, totalUsers.value - 1);
      }
      return success;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete user.';
      return false;
    } finally {
      isActionLoading.value = false;
    }
  }

  async function resetPassword(id: string) {
    isActionLoading.value = true;
    error.value = null;

    try {
      const result = await adminUsersService.resetPassword(id);
      return result;
    } catch (err: any) {
      error.value = err.message || 'Failed to reset user password.';
      return { success: false };
    } finally {
      isActionLoading.value = false;
    }
  }

  async function forceLogoutUser(id: string) {
    isActionLoading.value = true;
    error.value = null;

    try {
      const result = await adminUsersService.forceLogoutUser(id);
      userSessions.value = userSessions.value.filter((s) => s.userId !== id);
      if (selectedUser.value && selectedUser.value.id === id) {
        selectedUser.value.activeSessionsCount = 0;
      }
      return result;
    } catch (err: any) {
      error.value = err.message || 'Failed to force logout user sessions.';
      return { success: false, revokedSessions: 0 };
    } finally {
      isActionLoading.value = false;
    }
  }

  async function fetchUserAuditLogs(id: string) {
    try {
      const logs = await adminUsersService.getUserAuditLogs(id);
      userAuditLogs.value = logs;
    } catch (err) {
      userAuditLogs.value = [];
    }
  }

  async function fetchUserSessions(id: string) {
    try {
      const sessions = await adminUsersService.getUserSessions(id);
      userSessions.value = sessions;
    } catch (err) {
      userSessions.value = [];
    }
  }

  // Multi-Selection Logic
  function toggleUserSelection(id: string) {
    const set = new Set(selectedUserIds.value);
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    selectedUserIds.value = set;
  }

  function toggleSelectAll() {
    if (isAllSelected.value) {
      selectedUserIds.value = new Set();
    } else {
      selectedUserIds.value = new Set(users.value.map((u) => u.id));
    }
  }

  function clearSelection() {
    selectedUserIds.value = new Set();
  }

  async function executeBulkAction(action: BulkUserActionType, reason?: string) {
    if (selectedUserIds.value.size === 0) return;
    isActionLoading.value = true;
    error.value = null;

    const userIds = Array.from(selectedUserIds.value);

    try {
      const result = await adminUsersService.executeBulkAction({
        action,
        userIds,
        reason,
      });

      if (action === 'activate') {
        users.value.forEach((u) => {
          if (selectedUserIds.value.has(u.id)) u.status = 'ACTIVE';
        });
      } else if (action === 'suspend') {
        users.value.forEach((u) => {
          if (selectedUserIds.value.has(u.id)) u.status = 'SUSPENDED';
        });
      } else if (action === 'delete') {
        users.value = users.value.filter((u) => !selectedUserIds.value.has(u.id));
        totalUsers.value = Math.max(0, totalUsers.value - userIds.length);
      }

      clearSelection();
      return result;
    } catch (err: any) {
      error.value = err.message || 'Failed to execute bulk user action.';
      throw err;
    } finally {
      isActionLoading.value = false;
    }
  }

  // Filter setters
  function setSearch(query: string) {
    filters.search = query;
    fetchUsers(true);
  }

  function setRoleFilter(role: UserRole | 'ALL') {
    filters.role = role;
    fetchUsers(true);
  }

  function setStatusFilter(status: UserStatus | 'ALL') {
    filters.status = status;
    fetchUsers(true);
  }

  function setPage(page: number) {
    filters.page = page;
    fetchUsers();
  }

  function setPageSize(pageSize: number) {
    filters.pageSize = pageSize;
    fetchUsers(true);
  }

  // Real-time Event Updates
  function handleRealtimeUserCreated(user: ManagedUser) {
    users.value = [user, ...users.value];
    totalUsers.value += 1;
  }

  function handleRealtimeUserUpdated(payload: Partial<ManagedUser> & { id: string }) {
    const index = users.value.findIndex((u) => u.id === payload.id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...payload };
    }
    if (selectedUser.value?.id === payload.id) {
      selectedUser.value = { ...selectedUser.value, ...payload };
    }
  }

  return {
    // State
    users,
    selectedUser,
    selectedUserIds,
    filters,
    totalUsers,
    totalPages,
    userAuditLogs,
    userSessions,
    isLoading,
    isActionLoading,
    error,

    // Getters
    hasSelectedUsers,
    selectedUsersCount,
    isAllSelected,
    userStats,

    // Actions
    fetchUsers,
    fetchUserById,
    updateUserStatus,
    updateUser,
    deleteUser,
    resetPassword,
    forceLogoutUser,
    fetchUserAuditLogs,
    fetchUserSessions,
    toggleUserSelection,
    toggleSelectAll,
    clearSelection,
    executeBulkAction,
    setSearch,
    setRoleFilter,
    setStatusFilter,
    setPage,
    setPageSize,
    handleRealtimeUserCreated,
    handleRealtimeUserUpdated,
  };
});
