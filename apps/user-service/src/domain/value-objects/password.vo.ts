import { DDD } from '@clarte/shared-domain';
import { IncorrectPasswordFormatError } from '../exceptions/incorrect-password-format';

export class UserPassword extends DDD.ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static restore(value: string): UserPassword {
    return new UserPassword(value);
  }

  public static create(value: string): UserPassword {
    if (!value || value.trim() === '')
      throw new IncorrectPasswordFormatError('Password is not pass');
    return new UserPassword(value);
  }
}
