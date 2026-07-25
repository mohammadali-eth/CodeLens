import { Injectable, Logger } from '@nestjs/common';
import { ChatSession } from '../../domain/chat-session.entity';

@Injectable()
export class RedisChatCacheService {
  private readonly logger = new Logger(RedisChatCacheService.name);
  private readonly sessionCache = new Map<
    string,
    { session: ChatSession; expiresAt: number }
  >();
  private readonly defaultTtlMs = 1800000; // 30 minutes

  async getSession(sessionId: string): Promise<ChatSession | null> {
    const cached = this.sessionCache.get(sessionId);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.sessionCache.delete(sessionId);
      return null;
    }

    return Promise.resolve(cached.session);
  }

  async setSession(
    session: ChatSession,
    ttlMs = this.defaultTtlMs,
  ): Promise<void> {
    const expiresAt = Date.now() + ttlMs;
    this.sessionCache.set(session.id, { session, expiresAt });
    return Promise.resolve();
  }

  async invalidateSession(sessionId: string): Promise<void> {
    this.sessionCache.delete(sessionId);
    return Promise.resolve();
  }
}
