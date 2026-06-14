import { Contracts } from '@clarte/shared-contracts';

export interface IUserClient {
  getCredentialsByLogin(
    login: string,
  ): Promise<Contracts.Proto.User.UserGetCredentialsByLoginResponse>;

  findUserByLogin(
    login: string,
  ): Promise<Contracts.Proto.User.UserFindByLoginResponse>;

  createUser(
    id: string,
    login: string,
    passwordHash: string,
  ): Promise<void>;
}
