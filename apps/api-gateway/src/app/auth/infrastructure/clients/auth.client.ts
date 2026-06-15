import { OnModuleInit } from '@nestjs/common';
import { IAuthClient, InjectAuthGrpcClient } from '@/app/auth/aplication';
import { type ClientGrpc } from '@nestjs/microservices';
import { Contracts } from '@clarte/shared-contracts';
import { map, Observable } from 'rxjs';

export class AuthClient implements OnModuleInit, IAuthClient {
  private authService!: Contracts.Proto.Auth.AuthServiceClient;

  constructor(
    @InjectAuthGrpcClient() private readonly authGrpcClient: ClientGrpc,
  ) {}
  onModuleInit() {
    this.authService = this.authGrpcClient.getService(
      Contracts.Proto.Auth.AUTH_SERVICE_NAME,
    );
  }

  validate(
    data: Contracts.Proto.Auth.RegisterRequest,
  ): Observable<Contracts.Proto.Auth.ValidateUserResponse> {
    return this.authService.validateUser(data);
  }
  login(
    data: Contracts.Proto.Auth.LoginPasswordRequest,
  ): Observable<Contracts.Proto.Auth.LoginPasswordResponse> {
    return this.authService.loginPassword(data);
  }
  register(data: Contracts.Proto.Auth.RegisterRequest): Observable<void> {
    return this.authService.registerPassword(data).pipe(map(() => void 0));
  }

  getPublicJwtKey(): Observable<Contracts.Proto.Auth.GetPublicJwtKeyResponse> {
    return this.authService.getPublicJwtKey({});
  }

  refresh(
    data: Contracts.Proto.Auth.RefreshTokensRequest,
  ): Observable<Contracts.Proto.Auth.RefreshTokensResponse> {
    return this.authService.refreshTokens(data);
  }
}
