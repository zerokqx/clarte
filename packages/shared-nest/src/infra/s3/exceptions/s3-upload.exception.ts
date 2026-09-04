import { S3StorageException } from './s3.exception.js';

export class S3UploadException extends S3StorageException {
  readonly _tag = 'S3UploadException' as const;

  constructor(message = 'S3 upload failure', details?: Record<string, unknown>) {
    super(message, details);
  }
}
