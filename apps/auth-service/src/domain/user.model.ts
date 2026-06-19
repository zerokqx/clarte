import { AggregateRoot } from '@clarte/shared-domain/domain';
import { LoginVo, PasswordHashVo } from '@/domain/value-objects';
import { IPasswordHasher } from '@/domain/ports';

interface AuthUserPlain {
  id: string;
  login: string;
  passwordHash: string;
}

export class AuthUser extends AggregateRoot {
  private constructor(
    id: string,
    private readonly _login: LoginVo,
    private readonly _passwordHash: PasswordHashVo,
  ) {
    super(id);
  }

  public static async create(
    id: string,
    rawLogin: string,
    rawPassword: string,
    hasher: IPasswordHasher,
  ): Promise<AuthUser> {
    const login = LoginVo.create(rawLogin);

    const hashString = await hasher.hash(rawPassword);
    const passwordHash = PasswordHashVo.create(hashString);

    return new AuthUser(id, login, passwordHash);
  }

  public static restore(
    id: string,
    rawLogin: string,
    hashFromDb: string,
  ): AuthUser {
    return new AuthUser(
      id,
      LoginVo.restore(rawLogin),
      PasswordHashVo.create(hashFromDb),
    );
  }

  public async comparePassword(
    rawPassword: string,
    hasher: IPasswordHasher,
  ): Promise<boolean> {
    return await hasher.compare(rawPassword, this.passwordHash);
  }

  public getProps() {
    return {
      id: this.id,
      login: this.login,
      passwordHash: this.passwordHash,
    };
  }
  get login(): string {
    return this._login.value;
  }
  get passwordHash(): string {
    return this._passwordHash.value;
  }

  override toPlain(): AuthUserPlain {
    return {
      id: this.id,
      login: this.login,
      passwordHash: this.passwordHash,
    };
  }
}
