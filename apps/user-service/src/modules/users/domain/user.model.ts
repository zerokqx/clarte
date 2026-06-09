import { DDD } from '@clarte/shared';
import { IPasswordHasher } from './contracts/password-hasher.interface';
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

  public static async create(
    id: string,
    login: string,
    password: string,
    avatarUrl: string,
    hasher: IPasswordHasher,
  ): Promise<User> {
    return new User(
      id,
      UserLogin.create(login),
      await UserPassword.create(password, hasher),
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

  public comparePassword(
    password: string,
    hasher: IPasswordHasher,
  ): Promise<boolean> {
    return this._password.compare(password, hasher);
  }

  public async changePassword(
    oldPassword: string,
    newPassword: string,
    hasher: IPasswordHasher,
  ): Promise<void> {
    const isReallyOldPassword = await this._password.compare(
      oldPassword,
      hasher,
    );
    if (!isReallyOldPassword)
      throw new DDD.DomainException('The old password is incorrect');
    this._password = await UserPassword.create(newPassword, hasher);
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
