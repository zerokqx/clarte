import { EntityNotFoundError } from '@clarte/shared-errors';

export class TodoNotFoundException extends EntityNotFoundError {
  constructor(message = 'Todo not found', details?: Record<string, unknown>) {
    super(message, details);
  }
}
