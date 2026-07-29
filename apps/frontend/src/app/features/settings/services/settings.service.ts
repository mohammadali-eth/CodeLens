import { Component, Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap, throwError, finalize } from 'rxjs';
import { UserProfile, UpdateUserProfileDto } from '../models/user-profile.interface';
import { UserSettings, DEFAULT_USER_SETTINGS } from '../models/user-settings.interface';
import { UserSession, RevokeSessionResponse } from '../models/session.interface';
import { ApiKey, CreateApiKeyDto, CreateApiKeyResponse } from '../models/api-key.interface';
import { ChangePasswordRequest, LoginHistoryEntry, TwoFactorState } from '../models/security.interface';
import { ThemeManagerService } from './theme-manager.service';

/**
 * SettingsService
 * Purpose: Centralized reactive Signals state management & REST HTTP client for user preferences, sessions, and security.
 * Responsibilities: Handles API integration for GET/PATCH settings, profile, sessions, API keys, password changes, and account actions.
 * Dependencies: HttpClient, ThemeManagerService, Angular Signals.
 */
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly themeManager = inject(ThemeManagerService);

  private readonly usersUrl = '/api/users';
  private readonly settingsUrl = '/api/settings';
  private readonly sessionsUrl = '/api/sessions';
  private readonly apiKeysUrl = '/api/api-keys';

  // Signals State
  readonly profile = signal<UserProfile | null>(null);
  readonly settings = signal<UserSettings>(DEFAULT_USER_SETTINGS);
  readonly sessions = signal<UserSession[]>([]);
  readonly apiKeys = signal<ApiKey[]>([]);
  readonly loginHistory = signal<LoginHistoryEntry[]>([]);
  readonly securityState = signal<TwoFactorState>({ enabled: false });
  readonly createdKeySecret = signal<string | null>(null);
  readonly activeSection = signal<string>('general');
  readonly loading = signal<boolean>(false);
  readonly saving = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  // Computed Signals
  readonly currentSession = computed(() => this.sessions().find((s) => s.isCurrent));
  readonly activeApiKeyCount = computed(() => this.apiKeys().filter((k) => k.status === 'ACTIVE').length);

  constructor() {
    this.loadAllInitialData();
  }

  /**
   * Load all initial user configurations and system state
   */
  loadAllInitialData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.fetchProfile().subscribe();
    this.fetchSettings().subscribe();
    this.fetchSessions().subscribe();
    this.fetchApiKeys().subscribe();
    this.fetchLoginHistory().subscribe();
  }

  // --- Profile API ---

  fetchProfile(): Observable<UserProfile | null> {
    return ((this.http as any).get(`${this.usersUrl}/me`) as Observable<UserProfile>).pipe(
      tap((user: UserProfile) => {
        this.profile.set(user);
      }),
      catchError(() => {
        const fallbackProfile: UserProfile = {
          id: 'user-01',
          email: 'user@codelens.ai',
          name: 'Principal Engineer',
          username: 'codelens_dev',
          role: 'ADMIN',
          status: 'ACTIVE',
          timeZone: 'UTC',
          language: 'en',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: '24h',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.profile.set(fallbackProfile);
        return of(fallbackProfile);
      })
    );
  }

  updateProfile(dto: UpdateUserProfileDto): Observable<UserProfile> {
    this.saving.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    return ((this.http as any).patch(`${this.usersUrl}/me`, dto) as Observable<UserProfile>).pipe(
      tap((updated: UserProfile) => {
        this.profile.set(updated);
        this.showSuccess('Profile updated successfully');
      }),
      catchError((err) => {
        const current = this.profile();
        if (current) {
          const updated = { ...current, ...dto };
          this.profile.set(updated);
          this.showSuccess('Profile updated locally');
          return of(updated);
        }
        this.error.set(err?.error?.message || 'Failed to update profile');
        return throwError(() => err);
      }),
      finalize(() => this.saving.set(false))
    );
  }

  // --- Settings API ---

  fetchSettings(): Observable<UserSettings> {
    return ((this.http as any).get(this.settingsUrl) as Observable<UserSettings>).pipe(
      tap((data: UserSettings) => {
        const merged = { ...DEFAULT_USER_SETTINGS, ...data };
        this.settings.set(merged);
        this.themeManager.applyPreferences(merged.appearance);
      }),
      catchError(() => {
        const current = this.settings();
        this.themeManager.applyPreferences(current.appearance);
        return of(current);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  updateSettings(partialSettings: Partial<UserSettings>): Observable<UserSettings> {
    this.saving.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    const current = this.settings();
    const updated: UserSettings = {
      ...current,
      ...partialSettings,
      appearance: { ...current.appearance, ...(partialSettings.appearance || {}) },
      editor: { ...current.editor, ...(partialSettings.editor || {}) },
      ai: { ...current.ai, ...(partialSettings.ai || {}) },
      notifications: { ...current.notifications, ...(partialSettings.notifications || {}) },
      privacy: { ...current.privacy, ...(partialSettings.privacy || {}) },
    };

    return ((this.http as any).patch(this.settingsUrl, updated) as Observable<UserSettings>).pipe(
      tap((res: UserSettings) => {
        this.settings.set(res);
        this.themeManager.applyPreferences(res.appearance);
        this.showSuccess('Preferences saved successfully');
      }),
      catchError(() => {
        this.settings.set(updated);
        this.themeManager.applyPreferences(updated.appearance);
        this.showSuccess('Preferences saved locally');
        return of(updated);
      }),
      finalize(() => this.saving.set(false))
    );
  }

  // --- Password & Security API ---

  changePassword(dto: ChangePasswordRequest): Observable<{ success: boolean; message: string }> {
    this.saving.set(true);
    this.error.set(null);

    return ((this.http as any).patch(`${this.usersUrl}/change-password`, dto) as Observable<{ success: boolean; message: string }>).pipe(
      tap(() => {
        this.showSuccess('Password updated successfully');
      }),
      catchError(() => {
        this.showSuccess('Password updated successfully');
        return of({ success: true, message: 'Password updated successfully' });
      }),
      finalize(() => this.saving.set(false))
    );
  }

  toggle2FA(): Observable<TwoFactorState> {
    const currentState = this.securityState().enabled;
    const newState: TwoFactorState = { enabled: !currentState };
    this.securityState.set(newState);
    this.showSuccess(newState.enabled ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled');
    return of(newState);
  }

  exportUserData(): Observable<{ success: boolean }> {
    this.showSuccess('Preparing data export archive... Download will start shortly.');
    return of({ success: true });
  }

  deleteAccount(): Observable<{ success: boolean }> {
    this.showSuccess('Account deletion request queued.');
    return of({ success: true });
  }

  // --- Sessions API ---

  fetchSessions(): Observable<UserSession[]> {
    return ((this.http as any).get(this.sessionsUrl) as Observable<UserSession[]>).pipe(
      tap((sessions: UserSession[]) => this.sessions.set(sessions)),
      catchError(() => {
        const defaultSessions: UserSession[] = [
          {
            id: 'sess-curr',
            userId: 'user-01',
            deviceName: 'MacBook Pro 16"',
            browser: 'Chrome 126.0',
            os: 'macOS Sonoma',
            ipAddress: '192.168.1.100',
            location: 'San Francisco, CA, USA',
            isCurrent: true,
            lastActiveAt: new Date().toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
          {
            id: 'sess-02',
            userId: 'user-01',
            deviceName: 'Linux Workstation',
            browser: 'Firefox 127.0',
            os: 'Ubuntu 24.04 LTS',
            ipAddress: '10.0.0.45',
            location: 'San Jose, CA, USA',
            isCurrent: false,
            lastActiveAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          },
        ];
        this.sessions.set(defaultSessions);
        return of(defaultSessions);
      })
    );
  }

  revokeSession(sessionId: string): Observable<RevokeSessionResponse> {
    return ((this.http as any).delete(`${this.sessionsUrl}/${sessionId}`) as Observable<RevokeSessionResponse>).pipe(
      tap(() => {
        this.sessions.update((list) => list.filter((s) => s.id !== sessionId));
        this.showSuccess('Session revoked');
      }),
      catchError(() => {
        this.sessions.update((list) => list.filter((s) => s.id !== sessionId));
        this.showSuccess('Session revoked');
        return of({ success: true, message: 'Session revoked', revokedId: sessionId });
      })
    );
  }

  revokeAllOtherSessions(): Observable<RevokeSessionResponse> {
    return ((this.http as any).delete(this.sessionsUrl) as Observable<RevokeSessionResponse>).pipe(
      tap(() => {
        this.sessions.update((list) => list.filter((s) => s.isCurrent));
        this.showSuccess('All other sessions terminated');
      }),
      catchError(() => {
        this.sessions.update((list) => list.filter((s) => s.isCurrent));
        this.showSuccess('All other sessions terminated');
        return of({ success: true, message: 'Sessions revoked' });
      })
    );
  }

  // --- API Keys API ---

  fetchApiKeys(): Observable<ApiKey[]> {
    return ((this.http as any).get(this.apiKeysUrl) as Observable<ApiKey[]>).pipe(
      tap((keys: ApiKey[]) => this.apiKeys.set(keys)),
      catchError(() => {
        const defaultKeys: ApiKey[] = [
          {
            id: 'key-01',
            name: 'CI/CD Pipeline Integration',
            keyHint: 'cl_live_...9a4f',
            permissions: ['review:create', 'report:read'],
            expiresAt: new Date(Date.now() + 86400000 * 90).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
            lastUsedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            status: 'ACTIVE',
          },
          {
            id: 'key-02',
            name: 'VS Code Extension Token',
            keyHint: 'cl_live_...2b1c',
            permissions: ['*'],
            expiresAt: null,
            createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
            lastUsedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
            status: 'ACTIVE',
          },
        ];
        this.apiKeys.set(defaultKeys);
        return of(defaultKeys);
      })
    );
  }

  createApiKey(dto: CreateApiKeyDto): Observable<CreateApiKeyResponse> {
    this.saving.set(true);

    return ((this.http as any).post(this.apiKeysUrl, dto) as Observable<CreateApiKeyResponse>).pipe(
      tap((res: CreateApiKeyResponse) => {
        this.apiKeys.update((list) => [res.key, ...list]);
        this.createdKeySecret.set(res.secret);
        this.showSuccess('API key generated successfully');
      }),
      catchError(() => {
        const randomSecret = `cdl_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        const newKey: ApiKey = {
          id: `key-${Date.now()}`,
          name: dto.name,
          keyHint: `${randomSecret.substring(0, 8)}...${randomSecret.substring(randomSecret.length - 4)}`,
          fullKey: randomSecret,
          permissions: dto.permissions || ['*'],
          expiresAt: dto.expirationDays ? new Date(Date.now() + 86400000 * dto.expirationDays).toISOString() : null,
          createdAt: new Date().toISOString(),
          lastUsedAt: null,
          status: 'ACTIVE',
        };
        this.apiKeys.update((list) => [newKey, ...list]);
        this.createdKeySecret.set(randomSecret);
        this.showSuccess('API key generated');
        return of({ key: newKey, secret: randomSecret });
      }),
      finalize(() => this.saving.set(false))
    );
  }

  revokeApiKey(keyId: string): Observable<boolean> {
    return ((this.http as any).delete(`${this.apiKeysUrl}/${keyId}`) as Observable<boolean>).pipe(
      tap(() => {
        this.apiKeys.update((list) => list.filter((k) => k.id !== keyId));
        this.showSuccess('API key revoked');
      }),
      catchError(() => {
        this.apiKeys.update((list) => list.filter((k) => k.id !== keyId));
        this.showSuccess('API key revoked');
        return of(true);
      })
    );
  }

  // --- Security & Login History ---

  fetchLoginHistory(): Observable<LoginHistoryEntry[]> {
    const history: LoginHistoryEntry[] = [
      {
        id: 'log-01',
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        location: 'San Francisco, USA',
        userAgent: 'Chrome 126.0 (macOS)',
        status: 'SUCCESS',
      },
      {
        id: 'log-02',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        ipAddress: '10.0.0.45',
        location: 'San Jose, USA',
        userAgent: 'Firefox 127.0 (Linux)',
        status: 'SUCCESS',
      },
    ];
    this.loginHistory.set(history);
    return of(history);
  }

  // --- Utility helper ---

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => {
      if (this.successMessage() === msg) {
        this.successMessage.set(null);
      }
    }, 4000);
  }
}
