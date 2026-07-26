import { Params } from 'nestjs-pino';
import { RequestWithCorrelation } from './correlation-id.middleware';

export const getPinoLoggerConfig = (): Params => {
  const isProduction =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

  return {
    pinoHttp: {
      level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
      redact: {
        paths: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.body.password',
          'req.body.token',
          'req.body.secret',
          'req.body.apiKey',
        ],
        censor: '[REDACTED]',
      },
      customProps: (req: RequestWithCorrelation) => ({
        requestId: req.requestId,
        correlationId: req.correlationId,
      }),
      autoLogging: {
        ignore: (req) =>
          Boolean(
            req.url &&
            (req.url.includes('/health') || req.url.includes('/metrics')),
          ),
      },
      serializers: {
        req: (req: Record<string, unknown>) => ({
          id: req['id'],
          method: req['method'],
          url: req['url'],
          query: req['query'],
          params: req['params'],
        }),
        res: (res: Record<string, unknown>) => ({
          statusCode: res['statusCode'],
        }),
      },
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
    },
  };
};
