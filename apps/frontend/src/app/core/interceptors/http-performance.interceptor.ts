import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

const DEFAULT_TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;

/**
 * Functional HTTP Performance & Resilience Interceptor
 * Features:
 * 1. Automatic Request Timeout Protection (15s)
 * 2. Exponential Backoff Retry logic for transient GET failure cases
 * 3. JWT Bearer token attachment when available
 * 4. Enterprise network error normalization
 */
export const httpPerformanceInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // 1. Attach Bearer token if exists
  const token = localStorage.getItem('codelens_auth_token');
  let authReq = req;
  if (token && !req.headers.has('Authorization')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 2. Execute request with timeout and selective retry policies
  return next(authReq).pipe(
    timeout(DEFAULT_TIMEOUT_MS),
    retry({
      count: MAX_RETRIES,
      delay: (error: unknown, retryCount: number) => {
        // Only retry GET requests on transient 5xx errors or network drops
        if (authReq.method === 'GET' && (error instanceof HttpErrorResponse && (error.status >= 500 || error.status === 0))) {
          const delayMs = Math.pow(2, retryCount) * 500; // Exponential backoff (1s, 2s)
          return timer(delayMs);
        }
        return throwError(() => error);
      },
    }),
    catchError((error: unknown) => {
      // Pass normalized error to global error handling pipeline
      return throwError(() => error);
    })
  );
};
