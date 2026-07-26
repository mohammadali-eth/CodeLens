export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface ICircuitBreakerConfig {
  failureThreshold: number; // Number of consecutive failures to trip
  resetTimeoutMs: number; // Duration in ms to stay in OPEN state before trying HALF_OPEN
  halfOpenMaxSuccesses: number; // Successes required in HALF_OPEN state to CLOSE
  requestTimeoutMs: number; // Execution timeout for wrapped function call
}

export interface ICircuitBreakerStatus {
  name: string;
  state: CircuitBreakerState;
  failureCount: number;
  successCount: number;
  lastFailureTime: Date | null;
}
