import { IAuthClient } from '../application/ports';
import { map, Observable } from 'rxjs';
import { Auth } from '@clarte/shared-contracts/proto';
import { InjectAuthGrpcClient } from '../application/decorators';
import { OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';

export class AuthClient implements IAuthClient, OnModuleInit {
  private authService!: Auth.AuthServiceClient;
  constructor(
    @InjectAuthGrpcClient() private readonly grpcAuthClient: ClientGrpc,
  ) {}
  onModuleInit() {
    this.authService = this.grpcAuthClient.getService(Auth.AUTH_SERVICE_NAME);
  }

  getPublicKey(): Observable<string> {
    return this.authService
      .getPublicJwtKey({})
      .pipe(map((response) => response.key));
  }
}
