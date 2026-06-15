import { Contracts } from '@clarte/shared-contracts';
import { Observable } from 'rxjs';

export interface IAuthClient {
  validate(
    data: Contracts.Proto.Auth.RegisterRequest,
  ): Observable<Contracts.Proto.Auth.ValidateUserResponse>;

  login(
    data: Contracts.Proto.Auth.LoginPasswordRequest,
  ): Observable<Contracts.Proto.Auth.LoginPasswordResponse>;

  register(data: Contracts.Proto.Auth.RegisterRequest): Observable<void>;

  getPublicJwtKey(): Observable<Contracts.Proto.Auth.GetPublicJwtKeyResponse>;

  refresh(
    data: Contracts.Proto.Auth.RefreshTokensRequest,
  ): Observable<Contracts.Proto.Auth.RefreshTokensResponse>;
}
