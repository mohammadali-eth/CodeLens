export interface StoredFileResult {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  storagePath: string;
  url: string;
}

export interface IStorageService {
  uploadFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<StoredFileResult>;
  getFile(storagePath: string): Promise<Buffer>;
  deleteFile(storagePath: string): Promise<void>;
  getSignedUrl(storagePath: string, expiresSeconds?: number): Promise<string>;
}

export const IStorageService = Symbol('IStorageService');
