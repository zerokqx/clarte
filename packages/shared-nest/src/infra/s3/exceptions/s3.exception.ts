import { InternalDomainError } from '@clarte/shared-errors';

export abstract class S3StorageException extends InternalDomainError {
  abstract readonly _tag: string;

  constructor(message = 'S3 storage error', details?: Record<string, unknown>) {
    super(message, details);
  }
}
