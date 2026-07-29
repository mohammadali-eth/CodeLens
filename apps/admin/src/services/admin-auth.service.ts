import { apiClient } from '../core/api/api-client';
import { storageService } from '../core/services/storage.service';
import { AuthTokens, LoginCredentialsDto } from '../models';

/**
 * AdminAuthService
 * Purpose: Authentication API transport service for handling admin login, token refresh, and logout calls.
 * Responsibilities: Sends HTTP requests to NestJS auth endpoints and manages rememberMe storage policy.
 * Dependencies: ApiClient, StorageService, AuthTokens model.
 */

export class AdminAuthService {
  private static instance: AdminAuthService;
  private readonly REMEMBER_ME_KEY = 'codelens_admin_remember_me';

  private constructor() {}

  public static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  public async login(credentials: LoginCredentialsDto): Promise<AuthTokens> {
    const payload = {
      email: credentials.email,
      password: credentials.password,
    };

    const response = await apiClient.post<any>('/auth/login', payload);
    const data = response.data?.data || response.data;
    
    const tokens: AuthTokens = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn || 3600,
    };

    // Save Remember Me preference
    this.setRememberMePreference(!!credentials.rememberMe);

    return tokens;
  }

  public async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<any>('/auth/refresh', { refreshToken });
    const data = response.data?.data || response.data;

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn || 3600,
    };
  }

  public async logout(refreshToken?: string): Promise<void> {
    try {
      await apiClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      // Ignore network errors on logout to allow clean client-side session destruction
    }
  }

  public setRememberMePreference(remember: boolean): void {
    storageService.setItem(this.REMEMBER_ME_KEY, remember);
  }

  public getRememberMePreference(): boolean {
    return storageService.getItem<boolean>(this.REMEMBER_ME_KEY) || false;
  }

  public getStorageTarget(): Storage {
    return this.getRememberMePreference() ? localStorage : sessionStorage;
  }
}

export const adminAuthService = AdminAuthService.getInstance();
