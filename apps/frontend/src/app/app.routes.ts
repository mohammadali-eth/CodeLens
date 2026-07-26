import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/pages/signup-page.component').then(
        (m) => m.SignUpPageComponent,
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/pages/forgot-password-page.component').then(
        (m) => m.ForgotPasswordPageComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/pages/reset-password-page.component').then(
        (m) => m.ResetPasswordPageComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'workspace',
    loadComponent: () =>
      import('./features/workspace/pages/workspace-page.component').then(
        (m) => m.WorkspacePageComponent,
      ),
  },
  {
    path: 'reviews',
    loadComponent: () =>
      import('./features/reviews/pages/review-result-page.component').then(
        (m) => m.ReviewResultPageComponent,
      ),
  },
  {
    path: 'pull-requests',
    loadComponent: () =>
      import('./features/pull-requests/pull-requests-page.component').then(
        (m) => m.PullRequestsPageComponent,
      ),
  },
  {
    path: 'ai-analysis',
    loadComponent: () =>
      import('./features/ai-analysis/ai-analysis-page.component').then(
        (m) => m.AiAnalysisPageComponent,
      ),
  },
  {
    path: 'security-scan',
    loadComponent: () =>
      import('./features/security-scan/security-scan-page.component').then(
        (m) => m.SecurityScanPageComponent,
      ),
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./features/chat/pages/chat-page.component').then(
        (m) => m.ChatPageComponent,
      ),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./features/history/pages/review-history-page.component').then(
        (m) => m.ReviewHistoryPageComponent,
      ),
  },
  {
    path: 'team',
    loadComponent: () =>
      import('./features/team/team-page.component').then(
        (m) => m.TeamPageComponent,
      ),
  },
  {
    path: 'integrations',
    loadComponent: () =>
      import('./features/integrations/integrations-page.component').then(
        (m) => m.IntegrationsPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
