import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createApp } from 'vue';
import { telemetryService } from '../telemetry.service';

describe('TelemetryService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes global app error handler', () => {
    const app = createApp({ template: '<div></div>' });
    telemetryService.init(app);

    expect(app.config.errorHandler).toBeDefined();
    expect(typeof app.config.errorHandler).toBe('function');
  });

  it('captures errors without throwing', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const err = new Error('Test boundary exception');

    expect(() => {
      telemetryService.captureError(err, null, 'test-info');
    }).not.toThrow();

    if (import.meta.env.DEV) {
      expect(consoleSpy).toHaveBeenCalled();
    }
  });
});
