import { User } from '@clarte/shared-contracts/proto';

export interface IUserClient {
  getCredentialsByLogin(
    login: string,
  ): Promise<User.UserGetCredentialsByLoginResponse>;

  findUserByLogin(
    login: string,
  ): Promise<User.UserFindByLoginResponse>;

  createUser(
    id: string,
    login: string,
    passwordHash: string,
  ): Promise<void>;
}
