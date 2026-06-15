import { Contracts } from '@clarte/shared-contracts';
import { QueryBus } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { GetCredentialsByLoginQuery } from '@/application';
import { GetCredentialsDTO } from '@/presentation/dtos/get-credentials.dto';

@Contracts.Proto.User.UserCredentialsServiceControllerMethods()
export class UserCredentialsController
  implements Contracts.Proto.User.UserCredentialsServiceController
{
  constructor(private readonly queryBus: QueryBus) {}
  async getCredentialsByLogin(
    request: Contracts.Proto.User.UserGetCredentialsByLoginRequest,
  ): Promise<Contracts.Proto.User.UserGetCredentialsByLoginResponse> {
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
