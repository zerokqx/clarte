import { AuthEventPatern, type AuthEventPayloadMap } from '@clarte/shared-event-types/auth';
import {
  AggregateRoot,
  defineDomainEvent,
  unionEvents,
} from '@clarte/shared-domain/domain';
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

const UserLoginedEvent = defineDomainEvent(AuthEventPatern.UserLogined)<
  AuthEventPayloadMap[AuthEventPatern.UserLogined]
>();
const UserRegisteredEvent = defineDomainEvent(AuthEventPatern.UserRegistered)<
  AuthEventPayloadMap[AuthEventPatern.UserRegistered]
>();

const __unionEvents = unionEvents(UserLoginedEvent, UserRegisteredEvent);
type AuthUserUnionEvents = typeof __unionEvents;

export class AuthUser extends AggregateRoot<AuthUserProps, AuthUserUnionEvents> {
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

    const user = new AuthUser({ id, login, passwordHash });
    user.addDomainEvent(new UserRegisteredEvent({ userId: user.id }));
    return user;
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

  public async login(rawPassword: string, hasher: IPasswordHasher): Promise<void> {
    const isPasswordValid = await this.comparePassword(rawPassword, hasher);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    this.addDomainEvent(
      new UserLoginedEvent({
        userId: this.id,
      }),
    );
  }

  public getProps() {
    return {
      id: this.id,
      login: this.login,
      passwordHash: this.passwordHash,
    };
  }

  get loginValue(): string {
    return this._props.login.value;
  }

  get passwordHash(): string {
    return this._props.passwordHash.value;
  }

  override toPlain(): AuthUserPlain {
    return {
      id: this.id,
      login: this.loginValue,
      passwordHash: this.passwordHash,
    };
  }
}
