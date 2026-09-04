import { ServiceUnavailableError } from '@clarte/shared-errors';

export class UserServiceUnavailableException extends ServiceUnavailableError {
  constructor(message = 'User Service Unavailable', details?: Record<string, unknown>) {
    super(message, details);
  }
}
