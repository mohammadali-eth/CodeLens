import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard
 * Protects private application routes (e.g., /dashboard, /workspace, /settings).
 * If user is authenticated or has a valid stored token session, entry is granted immediately.
 * Otherwise, redirects to /login with returnUrl parameter.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() || authService.getToken()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

/**
 * Guest Guard
 * Restricts auth pages (/login, /signup, /forgot-password) for already authenticated users.
 * If user is already authenticated or has an active token, redirects directly to /dashboard.
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() || authService.getToken()) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
