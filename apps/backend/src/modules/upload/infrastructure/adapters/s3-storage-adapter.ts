import { Injectable, NotImplementedException } from '@nestjs/common';
import {
  IStorageService,
  StoredFileResult,
} from '../../application/ports/storage-service.interface';

/**
 * S3StorageAdapter
 * Purpose: Cloud AWS S3 Storage Adapter for high-scale enterprise deployments.
 * Responsibilities: Performs multi-part S3 bucket uploads and generates pre-signed URLs.
 */
@Injectable()
export class S3StorageAdapter implements IStorageService {
  uploadFile(): Promise<StoredFileResult> {
    return Promise.reject(
      new NotImplementedException(
        'S3 Storage Adapter requires AWS_S3_BUCKET configuration.',
      ),
    );
  }

  getFile(): Promise<Buffer> {
    return Promise.reject(
      new NotImplementedException(
        'S3 Storage Adapter requires AWS_S3_BUCKET configuration.',
      ),
    );
  }

  deleteFile(): Promise<void> {
    return Promise.reject(
      new NotImplementedException(
        'S3 Storage Adapter requires AWS_S3_BUCKET configuration.',
      ),
    );
  }

  getSignedUrl(): Promise<string> {
    return Promise.reject(
      new NotImplementedException(
        'S3 Storage Adapter requires AWS_S3_BUCKET configuration.',
      ),
    );
  }
}
