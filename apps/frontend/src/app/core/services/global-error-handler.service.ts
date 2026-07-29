import { ErrorHandler, Injectable, signal } from '@angular/core';

export interface AppErrorPayload {
  message: string;
  stack?: string;
  timestamp: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  readonly lastError = signal<AppErrorPayload | null>(null);
  readonly hasError = signal<boolean>(false);

  handleError(error: unknown): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    const payload: AppErrorPayload = {
      message: errorObj.message || 'An unexpected application error occurred.',
      stack: errorObj.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    // Update signal state for UI fallback notifications
    this.lastError.set(payload);
    this.hasError.set(true);

    // Suppress console spam in production; log structured format
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.error('[CodeLens Global Error Handler]:', payload);
    }
  }

  clearError(): void {
    this.lastError.set(null);
    this.hasError.set(false);
  }
}
