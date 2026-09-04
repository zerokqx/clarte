import { AuthenticationError } from '@clarte/shared-errors';

export class PasswordVerificationFailedException extends AuthenticationError {
  constructor(message = 'Password verification failed', details?: Record<string, unknown>) {
    super(message, details);
  }
}
