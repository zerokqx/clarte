import { InternalDomainError } from '@clarte/shared-errors';

export class CouldntSaveProfileError extends InternalDomainError {
  constructor(message = "Couldn't save profile", details?: Record<string, unknown>) {
    super(message, details);
  }
}
