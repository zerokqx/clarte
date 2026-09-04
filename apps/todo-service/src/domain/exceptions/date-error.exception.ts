import { ValidationError } from '@clarte/shared-errors';

export class DateException extends ValidationError {
  constructor(message = 'Date Error', details?: Record<string, unknown>) {
    super(message, details);
  }
}
