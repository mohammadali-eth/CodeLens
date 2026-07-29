import { apiClient } from '../core/api/api-client';
import { AdminUser, ChangePasswordDto, UpdateProfileDto, UserRole, AdminPermission, AccountStatus } from '../models';

/**
 * UserService
 * Purpose: User account management API service.
 * Responsibilities: Fetches admin profile, updates account details, and executes credential password changes.
 * Dependencies: ApiClient, AdminUser, DTO models.
 */

export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private mapToAdminUser(data: any): AdminUser {
    const rawData = data?.data || data;
    const nameParts = (rawData.name || '').trim().split(' ');
    const firstName = rawData.firstName || nameParts[0] || 'Admin';
    const lastName = rawData.lastName || nameParts.slice(1).join(' ') || 'User';
    const role = (rawData.role as UserRole) || UserRole.ADMIN;
    const permissions: AdminPermission[] = rawData.permissions || (role === UserRole.SUPER_ADMIN ? ['*'] : []);
    const accountStatus = (rawData.status || rawData.accountStatus || 'ACTIVE') as AccountStatus;

    return {
      id: rawData.id,
      email: rawData.email,
      firstName,
      lastName,
      role,
      permissions,
      accountStatus,
      isActive: accountStatus === 'ACTIVE',
      avatarUrl: rawData.avatarUrl,
      department: rawData.department || 'Platform Administration',
      lastLoginAt: rawData.lastLoginAt,
      createdAt: rawData.createdAt || new Date().toISOString(),
      updatedAt: rawData.updatedAt,
    };
  }

  public async getProfile(): Promise<AdminUser> {
    const response = await apiClient.get<any>('/users/me');
    return this.mapToAdminUser(response.data);
  }

  public async updateProfile(dto: UpdateProfileDto): Promise<AdminUser> {
    const response = await apiClient.patch<any>('/users/me', dto);
    return this.mapToAdminUser(response.data);
  }

  public async changePassword(dto: ChangePasswordDto): Promise<void> {
    await apiClient.patch('/users/change-password', {
      currentPassword: dto.currentPassword,
      newPassword: dto.newPassword,
    });
  }
}

export const userService = UserService.getInstance();
