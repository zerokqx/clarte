import { ConflictError } from '@clarte/shared-errors';

export class UserAlreadyExistsException extends ConflictError {
  constructor(message = 'User already exists', details?: Record<string, unknown>) {
    super(message, details);
  }
}
