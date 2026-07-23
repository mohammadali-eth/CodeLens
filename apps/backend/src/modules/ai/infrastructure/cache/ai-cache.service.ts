import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import { UnifiedAIResponse } from '../../domain/unified-ai-response.interface';
import { CodeFilePayload } from '../../domain/ai-engine-service.interface';

@Injectable()
export class AICacheService {
  private readonly logger = new Logger(AICacheService.name);
  private readonly memoryCache = new Map<
    string,
    { data: UnifiedAIResponse; expiresAt: number }
  >();
  private readonly defaultTtlSeconds = 86400; // 24 hours

  generateCacheKey(
    files: CodeFilePayload[],
    provider: string,
    promptVersion: string,
  ): string {
    const rawContent = files
      .map((f) => `${f.filename}:${f.language || 'auto'}:${f.content}`)
      .sort()
      .join('|');

    const hash = createHash('sha256')
      .update(`${provider}:${promptVersion}:${rawContent}`)
      .digest('hex');

    return `ai:analysis:${hash}`;
  }

  async get(key: string): Promise<UnifiedAIResponse | null> {
    const cached = this.memoryCache.get(key);
    if (!cached) return Promise.resolve(null);

    if (Date.now() > cached.expiresAt) {
      this.memoryCache.delete(key);
      return Promise.resolve(null);
    }

    this.logger.log(`Cache Hit for key: ${key}`);
    return Promise.resolve(cached.data);
  }

  async set(
    key: string,
    value: UnifiedAIResponse,
    ttlSeconds = this.defaultTtlSeconds,
  ): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.memoryCache.set(key, { data: value, expiresAt });
    this.logger.log(
      `Cached AI response under key: ${key} (TTL: ${ttlSeconds}s)`,
    );
    return Promise.resolve();
  }

  async invalidate(key: string): Promise<void> {
    this.memoryCache.delete(key);
    return Promise.resolve();
  }
}
