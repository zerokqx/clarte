import { EntityNotFoundError } from '@clarte/shared-errors';

export class S3NotFoundException extends EntityNotFoundError {
  readonly _tag = 'S3NotFoundException' as const;

  constructor(message = 'S3 file not found', details?: Record<string, unknown>) {
    super(message, details);
  }
}
