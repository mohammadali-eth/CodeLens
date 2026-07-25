import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class RedisDashboardCacheService {
  private readonly logger = new Logger(RedisDashboardCacheService.name);
  private readonly cacheStore = new Map<
    string,
    { data: unknown; expiresAt: number }
  >();
  private readonly defaultTtlMs = 300000; // 5 minutes

  generateCacheKey(
    prefix: string,
    userId?: string,
    filterObj?: Record<string, unknown>,
  ): string {
    const rawFilter = JSON.stringify(filterObj || {});
    const hash = createHash('sha256')
      .update(rawFilter)
      .digest('hex')
      .substring(0, 10);
    return `dashboard:${prefix}:${userId || 'global'}:${hash}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const cached = this.cacheStore.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.cacheStore.delete(key);
      return null;
    }

    return Promise.resolve(cached.data as T);
  }

  async set(
    key: string,
    data: unknown,
    ttlMs = this.defaultTtlMs,
  ): Promise<void> {
    const expiresAt = Date.now() + ttlMs;
    this.cacheStore.set(key, { data, expiresAt });
    return Promise.resolve();
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    for (const key of this.cacheStore.keys()) {
      if (key.startsWith(`dashboard:${prefix}`)) {
        this.cacheStore.delete(key);
      }
    }
    return Promise.resolve();
  }
}
