import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization: string;
  avatarUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'codelens_access_token';
  private readonly REFRESH_TOKEN_KEY = 'codelens_refresh_token';
  private readonly USER_KEY = 'codelens_user_session';

  // Signals for Auth State
  public currentUser = signal<User | null>(null);
  public isAuthenticated = signal<boolean>(false);
  public isLoadingAuth = signal<boolean>(true);

  constructor(private router: Router) {
    this.initAuthCheck();
  }

  /**
   * Verified startup auth check:
   * Examines localStorage for existing valid token and session.
   * Prevents flashing dashboard, redirect loops, or blank screens.
   */
  public initAuthCheck(): void {
    this.isLoadingAuth.set(true);

    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userRaw = localStorage.getItem(this.USER_KEY);

      if (token && userRaw) {
        const user: User = JSON.parse(userRaw);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } else {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      }
    } catch (error) {
      console.error('Error restoring auth session:', error);
      this.clearAuthStorage();
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
    } finally {
      this.isLoadingAuth.set(false);
    }
  }

  /**
   * Authenticate user with credentials
   */
  public login(email: string, password?: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          email: email || 'm.ali@codelens.io',
          name: email ? email.split('@')[0].replace('.', ' ') : 'Mohammad Ali',
          role: 'Principal SRE & Architect',
          organization: 'CodeLens Inc.',
        };
        const mockToken = 'jwt_token_' + Date.now();
        const mockRefreshToken = 'refresh_token_' + Date.now();

        localStorage.setItem(this.TOKEN_KEY, mockToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, mockRefreshToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));

        this.currentUser.set(mockUser);
        this.isAuthenticated.set(true);
        resolve(true);
      }, 500);
    });
  }

  /**
   * Register new user account
   */
  public signup(name: string, email: string, password?: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          email: email,
          name: name || email.split('@')[0],
          role: 'Engineering Lead',
          organization: 'Enterprise SaaS',
        };
        const mockToken = 'jwt_token_' + Date.now();
        const mockRefreshToken = 'refresh_token_' + Date.now();

        localStorage.setItem(this.TOKEN_KEY, mockToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, mockRefreshToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(mockUser));

        this.currentUser.set(mockUser);
        this.isAuthenticated.set(true);
        resolve(true);
      }, 500);
    });
  }

  /**
   * Logout user, clear storage, reset state, and navigate to home page
   */
  public logout(): void {
    this.clearAuthStorage();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  /**
   * Handle expired tokens or 401 Unauthorized API responses
   */
  public handleUnauthorized(): void {
    this.logout();
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private clearAuthStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
