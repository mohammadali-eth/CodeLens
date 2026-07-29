import { storageService } from './storage.service';
import { AuthTokens } from '../../models';

/**
 * AuthService
 * Purpose: Low-level access token and refresh token storage management.
 * Responsibilities: Save, retrieve, clear tokens and evaluate token presence.
 * Dependencies: StorageService.
 */

export class AuthService {
  private static instance: AuthService;
  private readonly TOKEN_KEY = 'codelens_admin_tokens';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public getTokens(): AuthTokens | null {
    return storageService.getItem<AuthTokens>(this.TOKEN_KEY);
  }

  public getAccessToken(): string | null {
    const tokens = this.getTokens();
    return tokens ? tokens.accessToken : null;
  }

  public getRefreshToken(): string | null {
    const tokens = this.getTokens();
    return tokens ? tokens.refreshToken : null;
  }

  public setTokens(tokens: AuthTokens): void {
    storageService.setItem(this.TOKEN_KEY, tokens);
  }

  public clearTokens(): void {
    storageService.removeItem(this.TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = AuthService.getInstance();
