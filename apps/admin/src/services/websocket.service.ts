import { appConfig } from '../config';
import { loggerService } from '../core/services/logger.service';

export type WebSocketEventHandler = (data: unknown) => void;

export class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private readonly handlers: Map<string, WebSocketEventHandler[]> = new Map();
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(token?: string): void {
    if (!appConfig.featureFlags.enableWebSockets) {
      loggerService.info('[WebSocketService] WebSockets disabled by feature flag.');
      return;
    }

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const wsUrl = token ? `${appConfig.wsUrl}?token=${token}` : appConfig.wsUrl;
    loggerService.info(`[WebSocketService] Connecting to ${appConfig.wsUrl}`);

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        loggerService.info('[WebSocketService] Realtime connection established.');
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const payload = JSON.parse(event.data);
          const { event: eventName, data } = payload;
          if (eventName && this.handlers.has(eventName)) {
            this.handlers.get(eventName)?.forEach((handler) => handler(data));
          }
        } catch (err) {
          loggerService.error('[WebSocketService] Error parsing WebSocket message', err);
        }
      };

      this.socket.onclose = () => {
        loggerService.warn('[WebSocketService] WebSocket connection closed.');
        this.attemptReconnect(token);
      };

      this.socket.onerror = (err) => {
        loggerService.error('[WebSocketService] WebSocket error', err);
      };
    } catch (error) {
      loggerService.error('[WebSocketService] Failed to create WebSocket connection', error);
    }
  }

  public on(eventName: string, handler: WebSocketEventHandler): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)?.push(handler);
  }

  public off(eventName: string, handler: WebSocketEventHandler): void {
    if (!this.handlers.has(eventName)) return;
    const list = this.handlers.get(eventName) || [];
    const index = list.indexOf(handler);
    if (index > -1) {
      list.splice(index, 1);
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private attemptReconnect(token?: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const timeout = Math.pow(2, this.reconnectAttempts) * 1000;
      loggerService.info(`[WebSocketService] Reconnecting in ${timeout}ms (Attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(token), timeout);
    }
  }
}

export const webSocketService = WebSocketService.getInstance();
