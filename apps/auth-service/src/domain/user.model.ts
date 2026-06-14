import { DDD } from '@clarte/shared-domain';
import { LoginVo, PasswordHashVo } from './value-objects';
import { IPasswordHasher } from './ports';

export class AuthUser extends DDD.AggregateRoot {
  private constructor(
    id: string,
    private readonly login: LoginVo,
    private readonly passwordHash: PasswordHashVo,
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
    return await hasher.compare(rawPassword, this.passwordHash.value);
  }

  public getProps() {
    return {
      id: this.id,
      login: this.login.value,
      passwordHash: this.passwordHash.value,
    };
  }
}
