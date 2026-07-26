import {
  ICircuitBreakerConfig,
  ICircuitBreakerStatus,
} from '../../domain/circuit-breaker-config.interface';

export const CIRCUIT_BREAKER_PORT = Symbol('CIRCUIT_BREAKER_PORT');

export interface ICircuitBreakerPort {
  execute<T>(
    name: string,
    fn: () => Promise<T>,
    fallbackFn?: (err: Error) => Promise<T>,
    config?: Partial<ICircuitBreakerConfig>,
  ): Promise<T>;
  getStatus(name: string): ICircuitBreakerStatus | null;
  getAllStatuses(): ICircuitBreakerStatus[];
  reset(name: string): void;
}
