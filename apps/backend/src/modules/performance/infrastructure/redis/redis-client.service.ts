import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import {
  ICacheManagerPort,
  CacheSetOptions,
} from '../../application/ports/cache-manager-port.interface';

@Injectable()
export class RedisClientService
  implements ICacheManagerPort, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisClientService.name);
  private client: Redis | null = null;
  private isConnected = false;

  // In-memory fallback for environments without an active Redis instance
  private readonly fallbackStore = new Map<
    string,
    { value: unknown; expiresAt?: number }
  >();
  private readonly fallbackTags = new Map<string, Set<string>>();

  private getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
  }

  public onModuleInit(): void {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = parseInt(process.env.REDIS_PORT || '6379', 10);
    const password = process.env.REDIS_PASSWORD || undefined;

    try {
      this.client = new Redis({
        host,
        port,
        password,
        lazyConnect: true,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn(
              `Redis connection retries exceeded (${times}). Operating in resilient fallback mode.`,
            );
            return null; // Stop retrying automatically
          }
          return Math.min(times * 200, 2000);
        },
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log(
          `Successfully connected to Redis instance at ${host}:${port}`,
        );
      });

      this.client.on('error', (err: unknown) => {
        this.isConnected = false;
        this.logger.warn(
          `Redis client error: ${this.getErrorMessage(err)}. Fallback cache active.`,
        );
      });

      // Attempt async connection without blocking NestJS boot
      this.client.connect().catch((err: unknown) => {
        this.isConnected = false;
        this.logger.warn(
          `Initial Redis connection failed (${this.getErrorMessage(err)}). Using resilient in-memory fallback store.`,
        );
      });
    } catch (error: unknown) {
      this.logger.warn(
        `Could not initialize Redis client: ${this.getErrorMessage(error)}. Operating in fallback mode.`,
      );
    }
  }

  public async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit().catch(() => {});
      this.logger.log('Redis client connection closed.');
    }
  }

  public getClient(): Redis | null {
    return this.client;
  }

  public isRedisReady(): boolean {
    return this.isConnected && !!this.client;
  }

  public async get<T>(key: string): Promise<T | null> {
    if (this.isRedisReady() && this.client) {
      try {
        const data = await this.client.get(key);
        if (!data) return null;
        return JSON.parse(data) as T;
      } catch (err: unknown) {
        this.logger.warn(
          `Redis GET failed for key "${key}": ${this.getErrorMessage(err)}`,
        );
      }
    }

    // Fallback store lookup
    const item = this.fallbackStore.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.fallbackStore.delete(key);
      return null;
    }
    return item.value as T;
  }

  public async set<T>(
    key: string,
    value: T,
    options?: CacheSetOptions,
  ): Promise<void> {
    const ttlSeconds = options?.ttlSeconds ?? 300; // Default 5 minutes
    const serialized = JSON.stringify(value);

    if (this.isRedisReady() && this.client) {
      try {
        await this.client.set(key, serialized, 'EX', ttlSeconds);

        if (options?.tags && options.tags.length > 0) {
          for (const tag of options.tags) {
            await this.client.sadd(`tag:${tag}`, key);
            await this.client.expire(`tag:${tag}`, ttlSeconds + 60);
          }
        }
        return;
      } catch (err: unknown) {
        this.logger.warn(
          `Redis SET failed for key "${key}": ${this.getErrorMessage(err)}`,
        );
      }
    }

    // Fallback store set
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.fallbackStore.set(key, { value, expiresAt });

    if (options?.tags) {
      for (const tag of options.tags) {
        if (!this.fallbackTags.has(tag)) {
          this.fallbackTags.set(tag, new Set());
        }
        this.fallbackTags.get(tag)!.add(key);
      }
    }
  }

  public async del(key: string): Promise<void> {
    if (this.isRedisReady() && this.client) {
      try {
        await this.client.del(key);
      } catch (err: unknown) {
        this.logger.warn(
          `Redis DEL failed for key "${key}": ${this.getErrorMessage(err)}`,
        );
      }
    }
    this.fallbackStore.delete(key);
  }

  public async delByPattern(pattern: string): Promise<number> {
    let deletedCount = 0;
    if (this.isRedisReady() && this.client) {
      try {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          deletedCount = await this.client.del(...keys);
        }
      } catch (err: unknown) {
        this.logger.warn(
          `Redis DEL pattern failed for "${pattern}": ${this.getErrorMessage(err)}`,
        );
      }
    }

    // Also clean matching keys in fallback store
    const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const key of this.fallbackStore.keys()) {
      if (regexPattern.test(key)) {
        this.fallbackStore.delete(key);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  public async invalidateByTag(tag: string): Promise<number> {
    let count = 0;
    if (this.isRedisReady() && this.client) {
      try {
        const tagKey = `tag:${tag}`;
        const keys = await this.client.smembers(tagKey);
        if (keys.length > 0) {
          count = await this.client.del(...keys);
        }
        await this.client.del(tagKey);
      } catch (err: unknown) {
        this.logger.warn(
          `Redis tag invalidation failed for tag "${tag}": ${this.getErrorMessage(err)}`,
        );
      }
    }

    // Fallback store tag cleanup
    const keysInTag = this.fallbackTags.get(tag);
    if (keysInTag) {
      for (const k of keysInTag) {
        if (this.fallbackStore.delete(k)) count++;
      }
      this.fallbackTags.delete(tag);
    }

    return count;
  }

  public async exists(key: string): Promise<boolean> {
    if (this.isRedisReady() && this.client) {
      try {
        const res = await this.client.exists(key);
        return res === 1;
      } catch (err: unknown) {
        this.logger.warn(
          `Redis EXISTS failed for key "${key}": ${this.getErrorMessage(err)}`,
        );
      }
    }
    const val = await this.get(key);
    return val !== null;
  }

  public async flushAll(): Promise<void> {
    if (this.isRedisReady() && this.client) {
      try {
        await this.client.flushall();
      } catch (err: unknown) {
        this.logger.warn(`Redis FLUSHALL failed: ${this.getErrorMessage(err)}`);
      }
    }
    this.fallbackStore.clear();
    this.fallbackTags.clear();
  }
}
