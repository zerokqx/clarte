import { AuthenticationError } from '@clarte/shared-errors';

export class UserCredentialsNotFound extends AuthenticationError {
  constructor(message = 'User credentials not found', details?: Record<string, unknown>) {
    super(message, details);
  }
}
