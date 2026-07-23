import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ReviewModule } from '../review/review.module';
import { IStorageService } from './application/ports/storage-service.interface';
import { LocalStorageAdapter } from './infrastructure/adapters/local-storage-adapter';
import { UploadController } from './infrastructure/controllers/upload.controller';

@Module({
  imports: [AuthModule, ReviewModule],
  controllers: [UploadController],
  providers: [
    {
      provide: IStorageService,
      useClass: LocalStorageAdapter,
    },
  ],
  exports: [IStorageService],
})
export class UploadModule {}
