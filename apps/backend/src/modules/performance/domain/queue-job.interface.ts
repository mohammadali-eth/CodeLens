import { QueueName } from './queue-name.enum';
import { JobPriority } from './job-priority.enum';

export interface IBackoffOptions {
  type: 'fixed' | 'exponential';
  delay: number;
}

export interface IJobOptions {
  priority?: JobPriority;
  delay?: number;
  attempts?: number;
  backoff?: IBackoffOptions;
  removeOnComplete?: boolean | number;
  removeOnFail?: boolean | number;
}

export interface IQueueJob<TData = any> {
  id?: string;
  name: string;
  queueName: QueueName;
  data: TData;
  opts?: IJobOptions;
  timestamp?: number;
}

export interface IQueueMetrics {
  queueName: QueueName;
  waitingCount: number;
  activeCount: number;
  completedCount: number;
  failedCount: number;
  delayedCount: number;
  paused: boolean;
}
