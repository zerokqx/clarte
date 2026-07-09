import { AggregateRoot } from '@clarte/shared-domain/domain';
import { LoginVo, PasswordHashVo } from '@/domain/value-objects';
import { IPasswordHasher } from '@/domain/ports';

interface AuthUserPlain {
  id: string;
  login: string;
  passwordHash: string;
}

interface AuthUserProps {
  id: string;
  login: LoginVo;
  passwordHash: PasswordHashVo;
}

interface RestoreAuthUserDto {
  id: string;
  login: string;
  passwordHash: string;
}

export class AuthUser extends AggregateRoot<AuthUserProps> {
  private constructor(props: AuthUserProps) {
    super(props);
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

    return new AuthUser({ id, login, passwordHash });
  }

  public static restore(dto: RestoreAuthUserDto): AuthUser {
    return new AuthUser({
      id: dto.id,
      login: LoginVo.restore(dto.login),
      passwordHash: PasswordHashVo.create(dto.passwordHash),
    });
  }

  public async comparePassword(rawPassword: string, hasher: IPasswordHasher): Promise<boolean> {
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
    return this._props.login.value;
  }

  get passwordHash(): string {
    return this._props.passwordHash.value;
  }

  override toPlain(): AuthUserPlain {
    return {
      id: this.id,
      login: this.login,
      passwordHash: this.passwordHash,
    };
  }
}
