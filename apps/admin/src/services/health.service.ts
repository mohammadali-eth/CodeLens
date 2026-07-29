import { apiClient } from '../core/api/api-client';
import { ApiResponse } from '../models';

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  database: 'connected' | 'disconnected';
  redis: 'connected' | 'disconnected';
}

export class HealthService {
  private static instance: HealthService;

  private constructor() {}

  public static getInstance(): HealthService {
    if (!HealthService.instance) {
      HealthService.instance = new HealthService();
    }
    return HealthService.instance;
  }

  public async checkHealth(): Promise<HealthCheckResponse> {
    const response = await apiClient.get<ApiResponse<HealthCheckResponse>>('/health');
    return response.data.data;
  }
}

export const healthService = HealthService.getInstance();
