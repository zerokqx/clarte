import { S3StorageException } from './s3.exception.js';

export class S3DeleteException extends S3StorageException {
  readonly _tag = 'S3DeleteException' as const;

  constructor(message = 'S3 delete failure', details?: Record<string, unknown>) {
    super(message, details);
  }
}
