import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, tap, throwError } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status?: string;
  organization?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * AuthService
 * Purpose: Enterprise authentication state manager & identity session controller.
 * Responsibilities: Instant synchronous session hydration from cache, background token verification via GET /users/me,
 * token refresh orchestration, and secure session destruction on explicit logout.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly API_BASE_URL = 'http://localhost:4000';
  private readonly TOKEN_KEY = 'codelens_access_token';
  private readonly REFRESH_TOKEN_KEY = 'codelens_refresh_token';
  private readonly USER_KEY = 'codelens_user_session';

  // Signals for Reactive Auth State
  public currentUser = signal<User | null>(null);
  public isAuthenticated = signal<boolean>(false);
  public isLoadingAuth = signal<boolean>(true);
  public authError = signal<string | null>(null);

  constructor() {
    this.hydrateFromStorage();
    this.initAuthCheck();
  }

  /**
   * Synchronous Session Hydration:
   * Immediately restores user profile and authentication status from localStorage on boot
   * to eliminate blank screens, flashing login screens, or premature route redirects.
   */
  private hydrateFromStorage(): void {
    const token = this.getToken();
    const cachedUserJson = localStorage.getItem(this.USER_KEY);

    if (token && cachedUserJson) {
      try {
        const cachedUser: User = JSON.parse(cachedUserJson);
        this.currentUser.set(cachedUser);
        this.isAuthenticated.set(true);
      } catch (err) {
        // Invalid JSON cache
        this.clearAuthStorage();
        this.clearAuthState();
      }
    }
  }

  /**
   * Verified Startup Session Verification:
   * Validates access token and fetches fresh user profile from GET /users/me.
   * If token is expired, authInterceptor handles refresh automatically.
   */
  public initAuthCheck(): void {
    const token = this.getToken();

    if (!token) {
      this.clearAuthState();
      this.isLoadingAuth.set(false);
      return;
    }

    this.isLoadingAuth.set(true);

    // Call GET /users/me to verify session against backend
    this.http.get<User>(`${this.API_BASE_URL}/users/me`).pipe(
      tap((user: User) => {
        this.setSessionUser(user);
        this.isAuthenticated.set(true);
        this.isLoadingAuth.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        // If GET /users/me fails even after authInterceptor token refresh attempts
        this.clearAuthStorage();
        this.clearAuthState();
        this.isLoadingAuth.set(false);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Authenticate user credentials against backend API
   */
  public login(email: string, password?: string): Observable<AuthResponse> {
    this.authError.set(null);
    return this.http.post<AuthResponse>(`${this.API_BASE_URL}/auth/login`, {
      email,
      password,
    }).pipe(
      tap((res: AuthResponse) => {
        this.saveTokens(res.accessToken, res.refreshToken);
        this.setSessionUser(res.user);
        this.isAuthenticated.set(true);
      }),
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.message || 'Invalid email or password credentials.';
        this.authError.set(message);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Register new user account with backend API
   */
  public signup(name: string, email: string, password?: string): Observable<User> {
    this.authError.set(null);
    return this.http.post<User>(`${this.API_BASE_URL}/auth/register`, {
      name,
      email,
      password,
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.message || 'Failed to register account.';
        this.authError.set(message);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Refresh Access Token using Refresh Token
   */
  public refreshToken(): Observable<RefreshResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<RefreshResponse>(`${this.API_BASE_URL}/auth/refresh`, {
      refreshToken,
    }).pipe(
      tap((res: RefreshResponse) => {
        this.saveTokens(res.accessToken, res.refreshToken);
      }),
      catchError((err: HttpErrorResponse) => {
        this.clearAuthStorage();
        this.clearAuthState();
        return throwError(() => err);
      })
    );
  }

  /**
   * Explicit User Logout Procedure:
   * Revokes refresh token on backend, clears local storage, resets state signals, and navigates to login page.
   */
  public logout(): void {
    const refreshToken = this.getRefreshToken();

    if (refreshToken && this.getToken()) {
      this.http.post(`${this.API_BASE_URL}/auth/logout`, { refreshToken }).pipe(
        catchError(() => of(null))
      ).subscribe();
    }

    this.clearAuthStorage();
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  /**
   * Handle expired sessions or 401 Unauthorized API responses
   */
  public handleUnauthorized(): void {
    this.clearAuthStorage();
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private setSessionUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private clearAuthStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private clearAuthState(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.authError.set(null);
  }
}
