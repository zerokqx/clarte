import { ValidationError } from '@clarte/shared-errors';

export class TokenInvalidError extends ValidationError {
  constructor(message = 'Token invalid', details?: Record<string, unknown>) {
    super(message, details);
  }
}
