import { QueueName } from '../../domain/queue-name.enum';
import { IQueueJob, IJobOptions, IQueueMetrics } from '../../domain/queue-job.interface';

export const QUEUE_SERVICE = Symbol('QUEUE_SERVICE');

export interface IQueueService {
  addJob<T = any>(queueName: QueueName, jobName: string, data: T, options?: IJobOptions): Promise<string>;
  getMetrics(queueName: QueueName): Promise<IQueueMetrics>;
  getAllMetrics(): Promise<IQueueMetrics[]>;
  pauseQueue(queueName: QueueName): Promise<void>;
  resumeQueue(queueName: QueueName): Promise<void>;
  cleanQueue(queueName: QueueName, gracePeriodMs: number, status?: 'completed' | 'failed'): Promise<number>;
}
