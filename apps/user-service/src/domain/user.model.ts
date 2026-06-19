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

export class User extends Entity {
  private constructor(
    _id: string,
    private _login: UserLogin,
    private _passwordHash: UserPassword,
    private _avatarUrl: UserAvatar,
  ) {
    super(_id);
  }

  public static create(
    id: string,
    login: string,
    hashedPassword: string,
    avatarUrl: string,
  ): User {
    return new User(
      id,
      UserLogin.create(login),
      UserPassword.create(hashedPassword),
      UserAvatar.create(avatarUrl),
    );
  }

  public static restore(
    id: string,
    login: string,
    password: string,
    avatarUrl: string,
  ): User {
    return new User(
      id,
      UserLogin.restore(login),
      UserPassword.restore(password),
      UserAvatar.restore(avatarUrl),
    );
  }

  public changeAvatar(newAvatar: string): void {
    this._avatarUrl = UserAvatar.create(newAvatar);
  }

  public changeLogin(newRawLogin: string): void {
    const newLogin = UserLogin.create(newRawLogin);
    if (this._login.equals(newLogin)) return;
    this._login = newLogin;
  }

  get passwordHash(): string {
    return this._passwordHash.value;
  }
  get login(): string {
    return this._login.value;
  }

  get avatarUrl(): string {
    return this._avatarUrl.value;
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
