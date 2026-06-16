import { Auth } from '@clarte/shared-contracts/proto';
import { Observable } from 'rxjs';

export interface IAuthClient {
  validate(
    data: Auth.RegisterRequest,
  ): Observable<Auth.ValidateUserResponse>;

  login(
    data: Auth.LoginPasswordRequest,
  ): Observable<Auth.LoginPasswordResponse>;

  register(data: Auth.RegisterRequest): Observable<void>;

  getPublicJwtKey(): Observable<Auth.GetPublicJwtKeyResponse>;

  refresh(
    data: Auth.RefreshTokensRequest,
  ): Observable<Auth.RefreshTokensResponse>;
}
