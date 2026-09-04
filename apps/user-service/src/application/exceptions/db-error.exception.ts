import { InternalDomainError } from '@clarte/shared-errors';

export class DbError extends InternalDomainError {
  constructor(message = 'Database operation failed', details?: Record<string, unknown>) {
    super(message, details);
  }
}
