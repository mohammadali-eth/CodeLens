import { appConfig } from '../../config';

/**
 * LoggerService
 * Purpose: Environment-aware logger that suppresses debug/info logs in production environments.
 * Responsibilities: Standardized console logging, error output formatting, and telemetric dispatch hooks.
 * Dependencies: AppConfig.
 */

export class LoggerService {
  private static instance: LoggerService;
  private readonly isDev: boolean = appConfig.isDevelopment;

  private constructor() {}

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public debug(message: string, ...optionalParams: unknown[]): void {
    if (this.isDev) {
      console.debug(`[DEBUG] ${message}`, ...optionalParams);
    }
  }

  public info(message: string, ...optionalParams: unknown[]): void {
    if (this.isDev) {
      console.info(`[INFO] ${message}`, ...optionalParams);
    }
  }

  public warn(message: string, ...optionalParams: unknown[]): void {
    console.warn(`[WARN] ${message}`, ...optionalParams);
  }

  public error(message: string, error?: unknown, ...optionalParams: unknown[]): void {
    console.error(`[ERROR] ${message}`, error, ...optionalParams);
  }
}

export const loggerService = LoggerService.getInstance();
