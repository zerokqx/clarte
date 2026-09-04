import { EntityNotFoundError } from '@clarte/shared-errors';

export class NotFoundCredentialsException extends EntityNotFoundError {
  constructor(message = 'Not found credentials', details?: Record<string, unknown>) {
    super(message, details);
  }
}
