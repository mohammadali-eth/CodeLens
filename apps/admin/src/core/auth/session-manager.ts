import { useAuthStore } from '../../stores/auth.store';
import { loggerService } from '../services/logger.service';

/**
 * Session Manager Engine
 * Purpose: Monitors user inactivity and token expiration to enforce automatic session timeout warnings and auto-logout.
 * Responsibilities: Listens for DOM user interaction events, computes countdown timers, triggers session warnings, and executes graceful logouts.
 * Dependencies: useAuthStore, LoggerService.
 */

export class SessionManager {
  private static instance: SessionManager;

  private inactivityTimer: ReturnType<typeof setTimeout> | null = null;
  private warningTimer: ReturnType<typeof setTimeout> | null = null;

  // 14 minutes inactivity -> Warning, 15 minutes -> Logout
  private readonly INACTIVITY_WARNING_MS = 14 * 60 * 1000;
  private readonly INACTIVITY_LOGOUT_MS = 15 * 60 * 1000;

  private isListening = false;

  private constructor() {}

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  public startMonitoring(): void {
    if (this.isListening) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, this.handleUserActivity, { passive: true }));
    this.isListening = true;

    this.resetTimers();
    loggerService.info('[SessionManager] Inactivity session monitoring started.');
  }

  public stopMonitoring(): void {
    if (!this.isListening) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((evt) => window.removeEventListener(evt, this.handleUserActivity));
    this.isListening = false;

    this.clearTimers();
    loggerService.info('[SessionManager] Inactivity session monitoring stopped.');
  }

  public extendSession(): void {
    const authStore = useAuthStore();
    authStore.touchSession();
    authStore.setSessionStatus('ACTIVE');
    this.resetTimers();
    loggerService.info('[SessionManager] User extended administrative session.');
  }

  private handleUserActivity = (): void => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return;

    // Only reset if session is active (not currently showing warning modal)
    if (authStore.sessionStatus === 'ACTIVE') {
      authStore.touchSession();
      this.resetTimers();
    }
  };

  private resetTimers(): void {
    this.clearTimers();

    this.warningTimer = setTimeout(() => {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated) {
        authStore.setSessionStatus('WARNING');
        loggerService.warn('[SessionManager] Session warning threshold reached.');
      }
    }, this.INACTIVITY_WARNING_MS);

    this.inactivityTimer = setTimeout(() => {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated) {
        loggerService.warn('[SessionManager] Session hard timeout reached. Executing auto-logout.');
        authStore.logout();
      }
    }, this.INACTIVITY_LOGOUT_MS);
  }

  private clearTimers(): void {
    if (this.warningTimer) clearTimeout(this.warningTimer);
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    this.warningTimer = null;
    this.inactivityTimer = null;
  }
}

export const sessionManager = SessionManager.getInstance();
