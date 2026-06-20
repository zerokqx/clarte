import { ValueObject } from '@clarte/shared-domain/domain';
import { TokenInvalidError } from '@/domain/exceptions';

export class TokenVo extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): TokenVo {
    if (!value || value.trim() === '') {
      throw new TokenInvalidError('Token cannot be empty');
    }

    const isJwt =
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(value);
    if (!isJwt) {
      throw new TokenInvalidError('Invalid token format');
    }

    return new TokenVo(value);
  }

  public static restore(value: string): TokenVo {
    return new TokenVo(value);
  }
}
