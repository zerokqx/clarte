import { Entity } from '@clarte/shared-domain/domain';
import { UserAvatar } from '@/domain/value-objects/avatar.vo';
import { UserLogin } from '@/domain/value-objects/login.vo';
import { UserPassword } from '@/domain/value-objects/password.vo';

interface UserPlain {
  id: string;
  login: string;
  passwordHash: string;
  avatarUrl: string;
}

interface UserProps {
  id: string;
  login: UserLogin;
  passwordHash: UserPassword;
  avatarUrl: UserAvatar;
}

interface CreateUserDto {
  id: string;
  login: string;
  passwordHash: string;
  avatarUrl: string;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps) {
    super(props);
  }

  public static create(dto: CreateUserDto): User {
    return new User({
      id: dto.id,
      login: UserLogin.create(dto.login),
      passwordHash: UserPassword.create(dto.passwordHash),
      avatarUrl: UserAvatar.create(dto.avatarUrl),
    });
  }

  public static restore(dto: CreateUserDto): User {
    return new User({
      id: dto.id,
      login: UserLogin.restore(dto.login),
      passwordHash: UserPassword.restore(dto.passwordHash),
      avatarUrl: UserAvatar.restore(dto.avatarUrl),
    });
  }

  public changeAvatar(newAvatar: string, defaultAvatar: string): void {
    this._props.avatarUrl = UserAvatar.create(newAvatar.trim() === '' ? defaultAvatar : newAvatar);
  }

  public changeLogin(newRawLogin: string): void {
    const newLogin = UserLogin.create(newRawLogin);
    if (this._props.login.equals(newLogin)) return;
    this._props.login = newLogin;
  }

  get passwordHash(): string {
    return this._props.passwordHash.value;
  }

  get login(): string {
    return this._props.login.value;
  }

  get avatarUrl(): string {
    return this._props.avatarUrl.value;
  }

  override toPlain(): UserPlain {
    return {
      id: this.id,
      login: this.login,
      passwordHash: this.passwordHash,
      avatarUrl: this.avatarUrl,
    };
  }
}
