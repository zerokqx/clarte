import { ValidationError } from '@clarte/shared-errors';

export class IdInvalidException extends ValidationError {
  constructor(message = 'Id Invalid Exception', details?: Record<string, unknown>) {
    super(message, details);
  }
}
