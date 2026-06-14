import { IUserClient } from '../../application';
import { OnModuleInit } from '@nestjs/common';
import { InjectUserGrpcClient } from '../user.decorator';
import { type ClientGrpc } from '@nestjs/microservices';
import { Contracts } from '@clarte/shared-contracts';
import { map, Observable } from 'rxjs';

export class UserClient implements IUserClient, OnModuleInit {
  private findService!: Contracts.Proto.User.UserFindServiceClient;
  private createService!: Contracts.Proto.User.UserCreateServiceClient;
  private credentialsService!: Contracts.Proto.User.UserCredentialsServiceClient;

  constructor(
    @InjectUserGrpcClient() private readonly userGrpcClient: ClientGrpc,
  ) {}
  onModuleInit() {
    this.findService = this.userGrpcClient.getService(
      Contracts.Proto.User.USER_FIND_SERVICE_NAME,
    );
    this.createService = this.userGrpcClient.getService(
      Contracts.Proto.User.USER_CREATE_SERVICE_NAME,
    );
    this.credentialsService = this.userGrpcClient.getService(
      Contracts.Proto.User.USER_CREDENTIALS_SERVICE_NAME,
    );
  }

  findUserById(
    id: string,
  ): Observable<Contracts.Proto.User.UserFindByIdResponse> {
    return this.findService.findById({ id });
  }

  findUserByLogin(
    login: string,
  ): Observable<Contracts.Proto.User.UserFindByLoginResponse> {
    return this.findService.findByLogin({ login });
  }

  createUser(data: Contracts.Proto.User.UserCreateRequest): Observable<void> {
    return this.createService.userCreate(data).pipe(map(() => void 0));
  }

  getCredentialsByLogin(
    login: string,
  ): Observable<Contracts.Proto.User.UserGetCredentialsByLoginResponse> {
    return this.credentialsService.getCredentialsByLogin({ login });
  }
}
