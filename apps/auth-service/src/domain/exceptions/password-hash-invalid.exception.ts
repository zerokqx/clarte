import { ValidationError } from '@clarte/shared-errors';

export class PasswordHashInvalidError extends ValidationError {
  constructor(message = 'Password hash invalid', details?: Record<string, unknown>) {
    super(message, details);
  }
}
