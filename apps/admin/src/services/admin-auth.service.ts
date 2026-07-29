import { apiClient } from '../core/api/api-client';
import { ApiResponse, AuthTokens } from '../models';

export interface LoginDto {
  email: string;
  passwordHash: string;
}

export class AdminAuthService {
  private static instance: AdminAuthService;

  private constructor() {}

  public static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  public async login(credentials: LoginDto): Promise<AuthTokens> {
    const response = await apiClient.post<ApiResponse<AuthTokens>>('/admin/auth/login', credentials);
    return response.data.data;
  }

  public async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<ApiResponse<AuthTokens>>('/admin/auth/refresh', { refreshToken });
    return response.data.data;
  }

  public async logout(): Promise<void> {
    await apiClient.post('/admin/auth/logout');
  }
}

export const adminAuthService = AdminAuthService.getInstance();
