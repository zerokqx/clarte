import { S3StorageException } from './s3.exception.js';

export class S3DownloadException extends S3StorageException {
  readonly _tag = 'S3DownloadException' as const;

  constructor(message = 'S3 download failure', details?: Record<string, unknown>) {
    super(message, details);
  }
}
