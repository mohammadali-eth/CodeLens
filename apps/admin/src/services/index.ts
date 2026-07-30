/**
 * Services Layer Barrel Export
 * Responsibilities: Domain HTTP API request execution handlers & WebSocket connection management.
 * Dependencies: Consumes Axios HTTP Client from core layer and domain interfaces from models.
 */

export const SERVICES_LAYER_TOKEN = 'CDL_ADMIN_SERVICES';

export * from './health.service';
export * from './admin-auth.service';
export * from './admin-users.service';
export * from './user.service';
export * from './websocket.service';
