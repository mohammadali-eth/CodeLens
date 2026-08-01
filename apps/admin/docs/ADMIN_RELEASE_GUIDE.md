# CodeLens Vue Admin Portal - Production Architecture & Release Guide

## 1. Architecture Overview
The CodeLens Vue Admin Portal is built with **Vue 3**, **TypeScript 5.6**, **Pinia**, **Vue Router 4**, **Axios**, and **Vite 5**.

### Key Architectural Layers:
- **`src/core/`**: Central infrastructure including authentication guards (`RoleGuard`, `PermissionGuard`), API transport interceptors (`apiClient`), layout shells (`AdminLayout`, `AuthLayout`), and global telemetry monitoring (`telemetryService`).
- **`src/features/`**: Feature-driven domain modules (`analytics`, `audit-logs`, `auth`, `dashboard`, `monitoring`, `reports`, `reviews`, `settings`, `system`, `users`).
- **`src/services/`**: Strongly-typed singleton transport services communicating with NestJS REST APIs.
- **`src/stores/`**: Pinia Composition API state stores with reactive state, computed getters, and async actions.
- **`src/shared/`**: Design system UI components (Tables, Drawers, Badges, Modals, Toasts).

---

## 2. Performance & Optimization Highlights
- **Dynamic Code-Splitting**: 100% of top-level feature routes are dynamically imported via Vite lazy chunks (`import()`).
- **Vendor Chunk Manual Splitting**:
  - `vendor-core` (`vue`, `pinia`, `vue-router`): **106.2 kB** (Gzip: **41.2 kB**)
  - `vendor-utils` (`@tanstack/vue-query`, `@vueuse/core`, `axios`): **45.9 kB** (Gzip: **17.6 kB**)
  - `index.js` Main Entry: **33.3 kB** (Gzip: **11.1 kB**)
- **Production Log Tree-Shaking**: All `console.log` and `debugger` statements are stripped in production builds (`esbuild.drop`).
- **Memory Leak Cleanups**: All WebSocket composables implement `onUnmounted` event listener teardowns.

---

## 3. Accessibility & WCAG 2.1 AA Compliance
- **Skip-to-Content**: Accessible skip link (`#main-content`) available on keyboard focus.
- **Screen Reader Landmarks**: `role="banner"`, `aria-label="Main Navigation"`, and descriptive `aria-label` tags on controls.
- **Keyboard Navigation**: High-contrast focus indicators (`:focus-visible`) across all interactive components.
- **Reduced Motion**: CSS `@media (prefers-reduced-motion: reduce)` rules disable non-essential animations.

---

## 4. Operational Telemetry & Error Monitoring
- **Global Vue Error Boundary**: `telemetryService` intercepts uncaught Vue runtime exceptions and unhandled promise rejections.
- **Realtime Telemetry Stream**: WebSocket channels (`monitoring:metrics_tick`, `system:flag_updated`) stream live server metrics to Pinia stores.

---

## 5. Deployment & Production Verification
```bash
# Type check & Vite Production Build
npm run build

# Execute Vitest Suite (30 unit tests across 7 test suites)
npx vitest run
```
