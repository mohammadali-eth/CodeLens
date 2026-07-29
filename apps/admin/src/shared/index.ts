/**
 * Shared Components Layer Barrel Export
 * Responsibilities: Reusable UI component library (AppCard, AppTable, SkeletonLoader, EmptyState, ErrorState, Toast, ConfirmationDialog).
 * Dependencies: Independent presentation components used across layouts and features.
 */

export const SHARED_LAYER_TOKEN = 'CDL_ADMIN_SHARED';

export { default as AppCard } from './components/AppCard.vue';
export { default as AppTable } from './components/AppTable.vue';
export { default as SkeletonLoader } from './components/SkeletonLoader.vue';
export { default as LoadingOverlay } from './components/LoadingOverlay.vue';
export { default as EmptyState } from './components/EmptyState.vue';
export { default as ErrorState } from './components/ErrorState.vue';
export { default as ConfirmationDialog } from './components/ConfirmationDialog.vue';
export { default as Toast } from './components/Toast.vue';
