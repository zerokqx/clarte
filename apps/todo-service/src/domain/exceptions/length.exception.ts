import { ValidationError } from '@clarte/shared-errors';

export class LengthInvalidException extends ValidationError {
  constructor(message = 'Length Error', details?: Record<string, unknown>) {
    super(message, details);
  }
}

export class LengthDescriptionInvalidException extends LengthInvalidException {
  constructor(message = 'Description length Error', details?: Record<string, unknown>) {
    super(message, details);
  }
}

export class LengthTitleInvalidException extends LengthInvalidException {
  constructor(message = 'Title length Error', details?: Record<string, unknown>) {
    super(message, details);
  }
}
