import { Contracts } from '@clarte/shared';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { USER_CLIENT } from './user.tokens';
import { type ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserFindService implements OnModuleInit {
  private userFindService!: Contracts.Proto.User.UserFindServiceClient;

  constructor(@Inject(USER_CLIENT) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userFindService =
      this.client.getService<Contracts.Proto.User.UserFindServiceClient>(
        Contracts.Proto.User.USER_FIND_SERVICE_NAME,
      );
  }

  findUserById(id: string): Promise<Contracts.Proto.User.User> {
    const source$ = this.userFindService.findById({ id });
    return firstValueFrom(source$);
  }
}
