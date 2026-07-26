import { Global, Module } from '@nestjs/common';
import { RedisClientService } from './redis-client.service';
import { CACHE_MANAGER_PORT } from '../../application/ports/cache-manager-port.interface';

@Global()
@Module({
  providers: [
    RedisClientService,
    {
      provide: CACHE_MANAGER_PORT,
      useExisting: RedisClientService,
    },
  ],
  exports: [RedisClientService, CACHE_MANAGER_PORT],
})
export class RedisModule {}
