import { DDD } from '@clarte/shared-domain';
import { UserAvatar } from './value-objects/avatar.vo';
import { UserLogin } from './value-objects/login.vo';
import { UserPassword } from './value-objects/password.vo';

export class User extends DDD.Entity {
  private constructor(
    _id: string,
    private _login: UserLogin,
    private _password: UserPassword,
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
    return this._password.value;
  }
  get login(): string {
    return this._login.value;
  }

  get avatarUrl(): string {
    return this._avatarUrl.value;
  }
}
