import { apiClient } from '../core/api/api-client';
import { AdminUser, ApiResponse, ChangePasswordDto, UpdateProfileDto } from '../models';

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

  public async getProfile(): Promise<AdminUser> {
    const response = await apiClient.get<ApiResponse<AdminUser>>('/users/me');
    return response.data.data;
  }

  public async updateProfile(dto: UpdateProfileDto): Promise<AdminUser> {
    const response = await apiClient.patch<ApiResponse<AdminUser>>('/users/me', dto);
    return response.data.data;
  }

  public async changePassword(dto: ChangePasswordDto): Promise<void> {
    await apiClient.patch('/users/change-password', {
      currentPassword: dto.currentPassword,
      newPassword: dto.newPassword,
    });
  }
}

export const userService = UserService.getInstance();
