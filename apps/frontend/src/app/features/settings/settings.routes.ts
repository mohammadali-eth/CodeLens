import { Routes } from '@angular/router';

/**
 * Settings Feature Routes
 * Purpose: Route definitions for Phase F9 Settings & User Preferences.
 * Responsibilities: Maps settings route to SettingsLayoutComponent.
 * Dependencies: SettingsLayoutComponent.
 */
export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/settings-layout.component').then(
        (m) => m.SettingsLayoutComponent
      ),
  },
];
