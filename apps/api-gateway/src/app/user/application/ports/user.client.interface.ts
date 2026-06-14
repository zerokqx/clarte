import { Contracts } from '@clarte/shared-contracts';
import { Observable } from 'rxjs';

export interface IUserClient {
  findUserById(
    id: string,
  ): Observable<Contracts.Proto.User.UserFindByIdResponse>;

  findUserByLogin(
    login: string,
  ): Observable<Contracts.Proto.User.UserFindByLoginResponse>;

  createUser(data: Contracts.Proto.User.UserCreateRequest): Observable<void>;

  getCredentialsByLogin(
    login: string,
  ): Observable<Contracts.Proto.User.UserGetCredentialsByLoginResponse>;
}
