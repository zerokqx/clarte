import { User } from '@clarte/shared-contracts/proto';
import { Observable } from 'rxjs';

export interface IUserClient {
  findUserById(
    id: string,
  ): Observable<User.UserFindByIdResponse>;

  findUserByLogin(
    login: string,
  ): Observable<User.UserFindByLoginResponse>;

  createUser(data: User.UserCreateRequest): Observable<void>;

  getCredentialsByLogin(
    login: string,
  ): Observable<User.UserGetCredentialsByLoginResponse>;
}
