import { ValidationError } from '@clarte/shared-errors';

export class IncorrectPasswordFormatError extends ValidationError {
  constructor(message = 'Incorrect password format', details?: Record<string, unknown>) {
    super(message, details);
  }
}
