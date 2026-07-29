import axios, { AxiosInstance } from 'axios';
import { appConfig } from '../../config';
import { setupInterceptors } from './interceptors';

/**
 * ApiClient Singleton Setup
 * Purpose: Centralized Axios instance pre-configured with base URL, default headers, 15s timeout, and interceptors.
 * Responsibilities: Primary HTTP transport engine for all domain services.
 * Dependencies: Axios, appConfig, setupInterceptors.
 */

export const apiClient: AxiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach JWT Auth, Refresh Token, Error Normalization, & Logging Interceptors
setupInterceptors(apiClient);
