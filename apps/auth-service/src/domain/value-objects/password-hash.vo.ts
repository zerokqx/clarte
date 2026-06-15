import { DDD } from '@clarte/shared-domain';
import { PasswordHashInvalidError } from '@/domain/exceptions';

export class PasswordHashVo extends DDD.ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): PasswordHashVo {
    if (!value || value.trim() === '') {
      throw new PasswordHashInvalidError('Password hash cannot be empty');
    }

    /**
     * Регулярное выражение для проверки формата Argon2id:
     * ^\$argon2id\$ -> начинается с идентификатора алгоритма
     * v=\d+\$ -> версия (обычно v=19)
     * m=\d+,t=\d+,p=\d+\$ -> параметры памяти (m), итераций (t) и параллелизма (p)
     * [A-Za-z0-9+/]+={0,2}\$ -> соль в формате Base64
     * [A-Za-z0-9+/]+={0,2}$ -> сам хеш в формате Base64
     */
    const isArgon2id =
      /^\$argon2id\$v=\d+\$m=\d+,t=\d+,p=\d+\$[A-Za-z0-9+/]+={0,2}\$[A-Za-z0-9+/]+={0,2}$/.test(
        value,
      );

    if (!isArgon2id) {
      throw new PasswordHashInvalidError(
        'Invalid password hash format (Argon2id expected)',
      );
    }

    return new PasswordHashVo(value);
  }
}
