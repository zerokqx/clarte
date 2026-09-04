import { EntityNotFoundError } from '@clarte/shared-errors';

export class NodeNotFoundException extends EntityNotFoundError {
  constructor(message = 'Node not found', details?: Record<string, unknown>) {
    super(message, details);
  }
}

export const NoteNotFoundException = NodeNotFoundException;
