/**
 * Feature: System Administration & Platform Configuration (Phase A7)
 * Purpose: Central barrel export for system administration components, views, models, and composables.
 * Responsibilities: Exports public API surface of the system administration feature module.
 * Dependencies: None.
 */

export * from './models/system-admin.model';
export { default as SystemView } from './views/SystemView.vue';
