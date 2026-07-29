/**
 * Models Layer Barrel Export
 * Responsibilities: Domain TypeScript interfaces, DTO definitions, enums, API request/response contracts matching NestJS backend.
 * Dependencies: Independent type definitions used across services, stores, composables, and components.
 */

export * from './auth.interface';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}
