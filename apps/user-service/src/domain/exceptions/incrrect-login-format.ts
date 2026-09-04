import { ValidationError } from '@clarte/shared-errors';

export class IncorrectLoginFormatError extends ValidationError {
  constructor(message = 'Incorrect login format', details?: Record<string, unknown>) {
    super(message, details);
  }
}
