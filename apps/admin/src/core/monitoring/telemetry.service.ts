import { App, ComponentPublicInstance } from 'vue';

export interface TelemetryErrorPayload {
  message: string;
  stack?: string;
  componentName?: string;
  info?: string;
  timestamp: string;
  url: string;
}

export class TelemetryService {
  private static instance: TelemetryService;

  private constructor() {}

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  public init(app: App): void {
    app.config.errorHandler = (err: unknown, instance: ComponentPublicInstance | null, info: string) => {
      this.captureError(err, instance, info);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        this.captureError(event.reason, null, 'unhandledrejection');
      });
    }
  }

  public captureError(err: unknown, instance: ComponentPublicInstance | null, info: string): void {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    const componentName = instance?.$options?.name || instance?.$options?.__name || 'UnknownComponent';

    const payload: TelemetryErrorPayload = {
      message: errorObj.message,
      stack: errorObj.stack,
      componentName,
      info,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'http://localhost',
    };

    if (import.meta.env.DEV) {
      console.error('[TelemetryService] Vue Error Captured:', payload);
    }
  }
}

export const telemetryService = TelemetryService.getInstance();
