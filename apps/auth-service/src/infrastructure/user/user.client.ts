import { OnModuleInit } from '@nestjs/common';
import { IUserClient } from '../../application';
import { InjectUserGrpcClient } from '../decorators/user-grpc-client.inject';
import { type ClientGrpc } from '@nestjs/microservices';
import { Contracts } from '@clarte/shared-contracts';
import { lastValueFrom } from 'rxjs';

export class UserClient implements OnModuleInit, IUserClient {
  private credentialsService!: Contracts.Proto.User.UserCredentialsServiceClient;
  private findService!: Contracts.Proto.User.UserFindServiceClient;
  private createService!: Contracts.Proto.User.UserCreateServiceClient;

  constructor(
    @InjectUserGrpcClient() private readonly userGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.credentialsService = this.userGrpcClient.getService(
      Contracts.Proto.User.USER_CREDENTIALS_SERVICE_NAME,
    );
    this.findService = this.userGrpcClient.getService(
      Contracts.Proto.User.USER_FIND_SERVICE_NAME,
    );
    this.createService = this.userGrpcClient.getService(
      Contracts.Proto.User.USER_CREATE_SERVICE_NAME,
    );
  }

  async getCredentialsByLogin(
    login: string,
  ): Promise<Contracts.Proto.User.UserGetCredentialsByLoginResponse> {
    const source$ = this.credentialsService.getCredentialsByLogin({ login });
    return lastValueFrom(source$);
  }

  findUserByLogin(
    login: string,
  ): Promise<Contracts.Proto.User.UserFindByLoginResponse> {
    const source$ = this.findService.findByLogin({ login });
    return lastValueFrom(source$);
  }

  async createUser(
    id: string,
    login: string,
    passwordHash: string,
  ): Promise<void> {
    const source$ = this.createService.userCreate({
      id,
      login,
      passwordHash,
    });
    await lastValueFrom(source$);
  }
}
