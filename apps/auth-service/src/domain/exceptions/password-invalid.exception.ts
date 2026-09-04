import { ValidationError } from '@clarte/shared-errors';

export class PasswordInvalidError extends ValidationError {
  constructor(message = 'Password invalid', details?: Record<string, unknown>) {
    super(message, details);
  }
}
