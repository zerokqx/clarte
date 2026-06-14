import { DDD } from '@clarte/shared-domain';
import { IncorrectLoginFormatError } from '../exceptions/incrrect-login-format';

export class UserLogin extends DDD.ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }
  static create(value: string): UserLogin {
    if (value.trim() === '')
      throw new IncorrectLoginFormatError('Login is not pass');
    if (value.length < 1) throw new IncorrectLoginFormatError('Login small');
    if (value.length > 30) throw new IncorrectLoginFormatError('Lenght must be 30');
    return new UserLogin(value);
  }

  static restore(value: string): UserLogin {
    return new UserLogin(value);
  }
}
