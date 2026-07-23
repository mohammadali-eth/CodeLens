import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly maxSizeBytes = 5 * 1024 * 1024; // 5 MB

  private readonly allowedExtensions = new Set([
    '.java',
    '.js',
    '.ts',
    '.py',
    '.cpp',
    '.c',
    '.cs',
    '.go',
    '.rs',
    '.php',
    '.txt',
    '.json',
  ]);

  transform(file?: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Source code file must be uploaded');
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Uploaded file cannot be empty');
    }

    if (file.size > this.maxSizeBytes) {
      throw new BadRequestException(`File size exceeds maximum limit of 5 MB`);
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!this.allowedExtensions.has(ext)) {
      throw new BadRequestException(
        `File extension "${ext}" is not supported. Supported extensions: ${Array.from(this.allowedExtensions).join(', ')}`,
      );
    }

    return file;
  }
}
