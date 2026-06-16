import { IUserClient } from '@/app/user/application';
import { OnModuleInit } from '@nestjs/common';
import { InjectUserGrpcClient } from '@/app/user/infrastructure/user.decorator';
import { type ClientGrpc } from '@nestjs/microservices';
import { User } from '@clarte/shared-contracts/proto';
import { map, Observable } from 'rxjs';

export class UserClient implements IUserClient, OnModuleInit {
  private findService!: User.UserFindServiceClient;
  private createService!: User.UserCreateServiceClient;
  private credentialsService!: User.UserCredentialsServiceClient;

  constructor(
    @InjectUserGrpcClient() private readonly userGrpcClient: ClientGrpc,
  ) {}
  onModuleInit() {
    this.findService = this.userGrpcClient.getService(
      User.USER_FIND_SERVICE_NAME,
    );
    this.createService = this.userGrpcClient.getService(
      User.USER_CREATE_SERVICE_NAME,
    );
    this.credentialsService = this.userGrpcClient.getService(
      User.USER_CREDENTIALS_SERVICE_NAME,
    );
  }

  findUserById(
    id: string,
  ): Observable<User.UserFindByIdResponse> {
    return this.findService.findById({ id });
  }

  findUserByLogin(
    login: string,
  ): Observable<User.UserFindByLoginResponse> {
    return this.findService.findByLogin({ login });
  }

  createUser(data: User.UserCreateRequest): Observable<void> {
    return this.createService.userCreate(data).pipe(map(() => void 0));
  }

  getCredentialsByLogin(
    login: string,
  ): Observable<User.UserGetCredentialsByLoginResponse> {
    return this.credentialsService.getCredentialsByLogin({ login });
  }
}
