/**
 * Review Management Feature Barrel Export Index
 * Purpose: Central export point for Phase A5 Review Management views, components, composables, and models.
 * Responsibilities: Provides clean public API for the reviews feature module.
 * Dependencies: Views, components, composables in features/reviews.
 */

export * from './models/review.model';
export * from './composables/useReviewRealtime';
export { default as ReviewsView } from './views/ReviewsView.vue';
export { default as ReviewStatusBadge } from './components/ReviewStatusBadge.vue';
export { default as QualityScoreBadge } from './components/QualityScoreBadge.vue';
export { default as SearchBar } from './components/SearchBar.vue';
export { default as ReviewFilterPanel } from './components/ReviewFilterPanel.vue';
export { default as ReviewCard } from './components/ReviewCard.vue';
export { default as ReviewTable } from './components/ReviewTable.vue';
export { default as ReviewMetadataPanel } from './components/ReviewMetadataPanel.vue';
export { default as ProcessingLogViewer } from './components/ProcessingLogViewer.vue';
export { default as ModeratorNotesPanel } from './components/ModeratorNotesPanel.vue';
export { default as ReviewDetailDrawer } from './components/ReviewDetailDrawer.vue';
export { default as BulkActionToolbar } from './components/BulkActionToolbar.vue';
export { default as RealtimeMetricsWidget } from './components/RealtimeMetricsWidget.vue';
