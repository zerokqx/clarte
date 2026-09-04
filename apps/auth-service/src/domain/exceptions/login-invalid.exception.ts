import { ValidationError } from '@clarte/shared-errors';

export class LoginInvalidError extends ValidationError {
  constructor(message = 'Login invalid', details?: Record<string, unknown>) {
    super(message, details);
  }
}
