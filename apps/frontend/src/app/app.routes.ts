import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public Marketing Website Routes
  {
    path: '',
    loadComponent: () =>
      import('./features/public/pages/home-page.component').then(
        (m) => m.HomePageComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/public/pages/about-page.component').then(
        (m) => m.AboutPageComponent
      ),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/public/pages/contact-page.component').then(
        (m) => m.ContactPageComponent
      ),
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import('./features/public/pages/pricing-page.component').then(
        (m) => m.PricingPageComponent
      ),
  },
  {
    path: 'features',
    loadComponent: () =>
      import('./features/public/pages/features-page.component').then(
        (m) => m.FeaturesPageComponent
      ),
  },
  {
    path: 'security',
    loadComponent: () =>
      import('./features/public/pages/security-page.component').then(
        (m) => m.SecurityPageComponent
      ),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./features/public/pages/privacy-page.component').then(
        (m) => m.PrivacyPageComponent
      ),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./features/public/pages/terms-page.component').then(
        (m) => m.TermsPageComponent
      ),
  },

  // Auth Routes (Accessible ONLY when NOT authenticated - guarded by guestGuard)
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/signup-page.component').then(
        (m) => m.SignUpPageComponent
      ),
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/forgot-password-page.component').then(
        (m) => m.ForgotPasswordPageComponent
      ),
  },
  {
    path: 'reset-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/reset-password-page.component').then(
        (m) => m.ResetPasswordPageComponent
      ),
  },

  // Protected Enterprise Workspace & Dashboard Routes (guarded by authGuard)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'workspace',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/workspace/pages/workspace-page.component').then(
        (m) => m.WorkspacePageComponent
      ),
  },
  {
    path: 'reviews',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/reviews/pages/review-result-page.component').then(
        (m) => m.ReviewResultPageComponent
      ),
  },
  {
    path: 'pull-requests',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/pull-requests/pull-requests-page.component').then(
        (m) => m.PullRequestsPageComponent
      ),
  },
  {
    path: 'ai-analysis',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/ai-analysis/ai-analysis-page.component').then(
        (m) => m.AiAnalysisPageComponent
      ),
  },
  {
    path: 'security-scan',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/security-scan/security-scan-page.component').then(
        (m) => m.SecurityScanPageComponent
      ),
  },
  {
    path: 'chat',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/chat/pages/chat-page.component').then(
        (m) => m.ChatPageComponent
      ),
  },
  {
    path: 'history',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/history/pages/review-history-page.component').then(
        (m) => m.ReviewHistoryPageComponent
      ),
  },
  {
    path: 'team',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/team/team-page.component').then(
        (m) => m.TeamPageComponent
      ),
  },
  {
    path: 'integrations',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/integrations/integrations-page.component').then(
        (m) => m.IntegrationsPageComponent
      ),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/settings/settings.routes').then(
        (m) => m.SETTINGS_ROUTES
      ),
  },

  // Fallback Route
  {
    path: '**',
    redirectTo: '',
  },
];
