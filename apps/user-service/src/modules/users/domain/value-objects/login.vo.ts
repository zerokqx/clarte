import { DDD } from '@clarte/shared';

export class UserLogin extends DDD.ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }
  static create(value: string): UserLogin {
    if (value.trim() === '') throw new Error('Login is not pass');
    if (value.length < 1) throw new Error('Login small');
    if (value.length > 30) throw new Error('Lenght must be 30');
    return new UserLogin(value);
  }

  static restore(value: string): UserLogin {
    return new UserLogin(value);
  }
}
