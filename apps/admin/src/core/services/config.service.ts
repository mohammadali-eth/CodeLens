import { appConfig, AppConfig, FeatureFlags } from '../../config';

/**
 * ConfigurationService
 * Purpose: Provides a reactive/singleton accessor for system configuration parameters and feature flags.
 * Responsibilities: Get API URLs, evaluate feature flags, check current environment state.
 * Dependencies: AppConfig.
 */

export class ConfigurationService {
  private static instance: ConfigurationService;
  private readonly config: AppConfig = appConfig;

  private constructor() {}

  public static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  public get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  public get wsUrl(): string {
    return this.config.wsUrl;
  }

  public get environment(): string {
    return this.config.environment;
  }

  public get isProduction(): boolean {
    return this.config.isProduction;
  }

  public isFeatureEnabled(flagName: keyof FeatureFlags): boolean {
    return !!this.config.featureFlags[flagName];
  }
}

export const configurationService = ConfigurationService.getInstance();
