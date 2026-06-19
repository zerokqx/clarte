import { ValueObject } from '@clarte/shared-domain/domain';
import { PasswordInvalidError } from '@/domain/exceptions';

export class PasswordVo extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): PasswordVo {
    if (!value || value.length < 8) {
      throw new PasswordInvalidError(
        'Password must be at least 8 characters long',
      );
    }

    // const hasNumber = /\d/.test(value);
    // const hasUppercase = /[A-Z]/.test(value);
    //
    // if (!hasNumber || !hasUppercase) {
    //   throw new PasswordInvalidError(
    //     'Password must contain at least one uppercase letter and one number',
    //   );
    // }

    return new PasswordVo(value);
  }
}
