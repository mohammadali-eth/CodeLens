export const METRICS_COLLECTOR_PORT = Symbol('METRICS_COLLECTOR_PORT');

export interface IMetricsSnapshot {
  apiLatencyAvgMs: number;
  cacheHitRatio: number;
  aiProviderLatencyMs: Record<string, number>;
  activeWorkerConcurrency: number;
  memoryUsageMb: number;
  cpuUsagePercentage: number;
  timestamp: Date;
}

export interface IMetricsCollectorPort {
  recordApiLatency(route: string, durationMs: number): void;
  recordCacheHit(isHit: boolean): void;
  recordAiLatency(provider: string, durationMs: number): void;
  getSnapshot(): Promise<IMetricsSnapshot>;
}
