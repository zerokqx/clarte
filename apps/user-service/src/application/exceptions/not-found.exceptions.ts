import { EntityNotFoundError } from '@clarte/shared-errors';

export class UserNotFound extends EntityNotFoundError {
  constructor(message = 'User not found', details?: Record<string, unknown>) {
    super(message, details);
  }
}
