export const CACHE_MANAGER_PORT = Symbol('CACHE_MANAGER_PORT');

export interface CacheSetOptions {
  ttlSeconds?: number;
  tags?: string[];
}

export interface ICacheManagerPort {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheSetOptions): Promise<void>;
  del(key: string): Promise<void>;
  delByPattern(pattern: string): Promise<number>;
  invalidateByTag(tag: string): Promise<number>;
  exists(key: string): Promise<boolean>;
  flushAll(): Promise<void>;
}
