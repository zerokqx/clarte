import { OnModuleInit } from '@nestjs/common';
import { IUserClient } from '@/application';
import { InjectUserGrpcClient } from '@/infrastructure/decorators/user-grpc-client.inject';
import { type ClientGrpc } from '@nestjs/microservices';
import { User } from '@clarte/shared-contracts/proto';
import { lastValueFrom } from 'rxjs';

export class UserClient implements OnModuleInit, IUserClient {
  private credentialsService!: User.UserCredentialsServiceClient;
  private findService!: User.UserFindServiceClient;
  private createService!: User.UserCreateServiceClient;

  constructor(
    @InjectUserGrpcClient() private readonly userGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.credentialsService = this.userGrpcClient.getService(
      User.USER_CREDENTIALS_SERVICE_NAME,
    );
    this.findService = this.userGrpcClient.getService(
      User.USER_FIND_SERVICE_NAME,
    );
    this.createService = this.userGrpcClient.getService(
      User.USER_CREATE_SERVICE_NAME,
    );
  }

  async getCredentialsByLogin(
    login: string,
  ): Promise<User.UserGetCredentialsByLoginResponse> {
    const source$ = this.credentialsService.getCredentialsByLogin({ login });
    return lastValueFrom(source$);
  }

  findUserByLogin(
    login: string,
  ): Promise<User.UserFindByLoginResponse> {
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
