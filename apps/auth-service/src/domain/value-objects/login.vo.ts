import { DDD } from '@clarte/shared-domain';
import { LoginInvalidError } from '@/domain/exceptions';

export class LoginVo extends DDD.ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): LoginVo {
    if (value.trim() === '')
      throw new LoginInvalidError(`Login ${value} don't have correct format`);
    return new LoginVo(value);
  }

  public static restore(value: string): LoginVo {
    return new LoginVo(value);
  }
}
