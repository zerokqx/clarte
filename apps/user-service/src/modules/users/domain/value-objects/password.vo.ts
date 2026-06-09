import { IPasswordHasher } from '../contracts/password-hasher.interface';
import { DDD } from '@clarte/shared';

export class UserPassword extends DDD.ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static restore(value: string): UserPassword {
    return new UserPassword(value);
  }
  static async create(
    value: string,
    hasher: IPasswordHasher,
  ): Promise<UserPassword> {
    if (value.trim() === '') throw new Error('Password is not pass');
    const hash = await hasher.hash(value);
    return new UserPassword(hash);
  }
  public async compare(
    plainPassword: string,
    hasher: IPasswordHasher,
  ): Promise<boolean> {
    return hasher.verify(this.value, plainPassword);
  }
}
