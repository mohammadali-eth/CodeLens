import { apiClient } from '../core/api/api-client';
import { AdminUser, ApiResponse } from '../models';

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
}

export const userService = UserService.getInstance();
