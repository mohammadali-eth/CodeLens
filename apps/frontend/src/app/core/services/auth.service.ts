import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError, switchMap } from 'rxjs';

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

  // Signals for Auth State
  public currentUser = signal<User | null>(null);
  public isAuthenticated = signal<boolean>(false);
  public isLoadingAuth = signal<boolean>(true);
  public authError = signal<string | null>(null);

  constructor() {
    this.initAuthCheck();
  }

  /**
   * Verified startup auth check:
   * Examines localStorage for existing token, then verifies against /users/me endpoint.
   */
  public initAuthCheck(): void {
    this.isLoadingAuth.set(true);
    const token = this.getToken();

    if (!token) {
      this.clearAuthState();
      this.isLoadingAuth.set(false);
      return;
    }

    // Validate token and fetch fresh user profile from backend
    this.http.get<User>(`${this.API_BASE_URL}/users/me`).pipe(
      tap((user) => {
        this.setSessionUser(user);
        this.isAuthenticated.set(true);
        this.isLoadingAuth.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        // If token is expired, try refreshing
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
          return this.refreshToken().pipe(
            switchMap(() => this.http.get<User>(`${this.API_BASE_URL}/users/me`)),
            tap((user) => {
              this.setSessionUser(user);
              this.isAuthenticated.set(true);
              this.isLoadingAuth.set(false);
            }),
            catchError(() => {
              this.clearAuthStorage();
              this.clearAuthState();
              this.isLoadingAuth.set(false);
              return of(null);
            })
          );
        } else {
          this.clearAuthStorage();
          this.clearAuthState();
          this.isLoadingAuth.set(false);
          return of(null);
        }
      })
    ).subscribe();
  }

  /**
   * Authenticate user with backend API credentials
   */
  public login(email: string, password?: string): Observable<AuthResponse> {
    this.authError.set(null);
    return this.http.post<AuthResponse>(`${this.API_BASE_URL}/auth/login`, {
      email,
      password,
    }).pipe(
      tap((res) => {
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
      tap((user) => {
        // Optionally auto-login after signup
      }),
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.message || 'Failed to register account.';
        this.authError.set(message);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Refresh expired Access Token using Refresh Token
   */
  public refreshToken(): Observable<RefreshResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<RefreshResponse>(`${this.API_BASE_URL}/auth/refresh`, {
      refreshToken,
    }).pipe(
      tap((res) => {
        this.saveTokens(res.accessToken, res.refreshToken);
      }),
      catchError((err) => {
        this.clearAuthStorage();
        this.clearAuthState();
        return throwError(() => err);
      })
    );
  }

  /**
   * Logout user, notify backend, clear storage, and redirect
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
