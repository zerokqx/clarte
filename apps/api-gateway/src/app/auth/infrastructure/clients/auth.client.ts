import { OnModuleInit } from '@nestjs/common';
import { IAuthClient, InjectAuthGrpcClient } from '@/app/auth/aplication';
import { type ClientGrpc } from '@nestjs/microservices';
import { Auth } from '@clarte/shared-contracts/proto';
import { map, Observable } from 'rxjs';

export class AuthClient implements OnModuleInit, IAuthClient {
  private authService!: Auth.AuthServiceClient;

  constructor(
    @InjectAuthGrpcClient() private readonly authGrpcClient: ClientGrpc,
  ) {}
  onModuleInit() {
    this.authService = this.authGrpcClient.getService(
      Auth.AUTH_SERVICE_NAME,
    );
  }

  validate(
    data: Auth.RegisterRequest,
  ): Observable<Auth.ValidateUserResponse> {
    return this.authService.validateUser(data);
  }
  login(
    data: Auth.LoginPasswordRequest,
  ): Observable<Auth.LoginPasswordResponse> {
    return this.authService.loginPassword(data);
  }
  register(data: Auth.RegisterRequest): Observable<void> {
    return this.authService.registerPassword(data).pipe(map(() => void 0));
  }

  getPublicJwtKey(): Observable<Auth.GetPublicJwtKeyResponse> {
    return this.authService.getPublicJwtKey({});
  }

  refresh(
    data: Auth.RefreshTokensRequest,
  ): Observable<Auth.RefreshTokensResponse> {
    return this.authService.refreshTokens(data);
  }
}
