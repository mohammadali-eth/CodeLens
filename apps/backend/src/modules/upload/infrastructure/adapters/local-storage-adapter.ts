import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import {
  IStorageService,
  StoredFileResult,
} from '../../application/ports/storage-service.interface';

@Injectable()
export class LocalStorageAdapter implements IStorageService {
  private readonly baseUploadDir: string;

  constructor() {
    this.baseUploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.baseUploadDir)) {
      fs.mkdirSync(this.baseUploadDir, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'reviews',
  ): Promise<StoredFileResult> {
    try {
      const targetDir = path.join(this.baseUploadDir, folder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const fileExtension = path.extname(file.originalname);
      const uniqueName = `${randomUUID()}${fileExtension}`;
      const fullPath = path.join(targetDir, uniqueName);

      await fs.promises.writeFile(fullPath, file.buffer);

      const relativePath = path.join(folder, uniqueName);

      return {
        filename: uniqueName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storagePath: relativePath,
        url: `/uploads/${relativePath}`,
      };
    } catch (error: unknown) {
      const errMessage =
        error instanceof Error ? error.message : 'Unknown storage error';
      throw new InternalServerErrorException(
        `Local file storage failed: ${errMessage}`,
      );
    }
  }

  async getFile(storagePath: string): Promise<Buffer> {
    const fullPath = path.join(this.baseUploadDir, storagePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File at path "${storagePath}" not found`);
    }
    return await fs.promises.readFile(fullPath);
  }

  async deleteFile(storagePath: string): Promise<void> {
    const fullPath = path.join(this.baseUploadDir, storagePath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }

  getSignedUrl(storagePath: string): Promise<string> {
    return Promise.resolve(`/uploads/${storagePath}`);
  }
}
