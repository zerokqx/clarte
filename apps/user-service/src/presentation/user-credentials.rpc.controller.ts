import { User } from '@clarte/shared-contracts/proto';
import { QueryBus } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { GetCredentialsByLoginQuery } from '@/application';
import { GetCredentialsDTO } from '@/presentation/dtos/get-credentials.dto';

@User.UserCredentialsServiceControllerMethods()
export class UserCredentialsController
  implements User.UserCredentialsServiceController
{
  constructor(private readonly queryBus: QueryBus) {}
  async getCredentialsByLogin(
    request: User.UserGetCredentialsByLoginRequest,
  ): Promise<User.UserGetCredentialsByLoginResponse> {
    const query = new GetCredentialsByLoginQuery(request.login);
    const credentials = await this.queryBus.execute(query);
    if (!credentials)
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Credentials not found for user ${request.login}`,
      });
    return new GetCredentialsDTO({
      passwordHash: credentials.passwordHash,
      id: credentials.id,
      login: credentials.login,
    });
  }
}
