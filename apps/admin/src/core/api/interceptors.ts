import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authService } from '../services/auth.service';
import { loggerService } from '../services/logger.service';
import { ApiError } from './api-error';
import { AuthTokens } from '../../models';

interface FailedRequestQueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequestQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Global reactive active request counter for loading overlays
let activeRequestCount = 0;
export const getActiveRequestCount = (): number => activeRequestCount;

export function setupInterceptors(client: AxiosInstance): void {
  // 1. Request Interceptor: Attach Auth Token, Logging, & Loading Tracker
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      activeRequestCount++;
      (config as InternalAxiosRequestConfig & { _startTime?: number })._startTime = Date.now();

      const token = authService.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      loggerService.debug(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error: unknown) => {
      activeRequestCount = Math.max(0, activeRequestCount - 1);
      return Promise.reject(error);
    }
  );

  // 2. Response Interceptor: Handle 401 Refresh, Error Normalization, Logging, & Loading Decrement
  client.interceptors.response.use(
    (response) => {
      activeRequestCount = Math.max(0, activeRequestCount - 1);
      const startTime = (response.config as InternalAxiosRequestConfig & { _startTime?: number })._startTime;
      const duration = startTime ? Date.now() - startTime : 0;

      loggerService.debug(
        `[HTTP Response] ${response.status} ${response.config.url} (${duration}ms)`
      );
      return response;
    },
    async (error: AxiosError) => {
      activeRequestCount = Math.max(0, activeRequestCount - 1);
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 Unauthorized for Token Refresh
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        const refreshToken = authService.getRefreshToken();
        
        // If request was for login or refresh itself, or no refresh token, fail immediately
        if (!refreshToken || originalRequest.url?.includes('/admin/auth/')) {
          authService.clearTokens();
          return Promise.reject(ApiError.fromResponse(401, error.response?.data));
        }

        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return client(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Execute refresh call via raw client to prevent infinite interceptor loops
          const response = await client.post<AuthTokens>('/admin/auth/refresh', {
            refreshToken,
          });

          const newTokens = response.data;
          authService.setTokens(newTokens);
          isRefreshing = false;

          processQueue(null, newTokens.accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          }

          return client(originalRequest);
        } catch (refreshErr) {
          isRefreshing = false;
          authService.clearTokens();
          processQueue(refreshErr, null);
          return Promise.reject(ApiError.fromResponse(401, error.response?.data));
        }
      }

      const statusCode = error.response?.status || 500;
      const normalizedError = ApiError.fromResponse(statusCode, error.response?.data);
      loggerService.error(`[HTTP Error] ${statusCode} ${originalRequest?.url}`, normalizedError);

      return Promise.reject(normalizedError);
    }
  );
}
