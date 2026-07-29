/**
 * Layouts Layer Barrel Export
 * Responsibilities: Layout containers (AdminLayout.vue, AuthLayout.vue) wrapping header, sidebar, footer, and main router view.
 * Dependencies: Consumes shared components and router view.
 */

export const LAYOUTS_LAYER_TOKEN = 'CDL_ADMIN_LAYOUTS';

export { default as AdminLayout } from './AdminLayout.vue';
export { default as AuthLayout } from './AuthLayout.vue';
