import { ValidationError } from '@clarte/shared-errors';

export class AvatarWrongError extends ValidationError {
  constructor(message = 'Avatar wrong', details?: Record<string, unknown>) {
    super(message, details);
  }
}
