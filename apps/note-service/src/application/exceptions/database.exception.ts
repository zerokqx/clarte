import { InternalDomainError } from '@clarte/shared-errors';

export class DatabaseException extends InternalDomainError {
  constructor(message = 'Database Error', details?: Record<string, unknown>) {
    super(message, details);
  }
}
