import { Contracts } from '@clarte/shared';
import { QueryBus } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { GetCredentialsByIdQuery } from '../application/queries/get-credentials-by-id/get-credentials-by-id.query';

@Contracts.Proto.User.UserCredentialsServiceControllerMethods()
export class UserCredentialsController
  implements Contracts.Proto.User.UserCredentialsServiceController
{
  constructor(private readonly queryBus: QueryBus) {}
  async getCredentialsById(
    request: Contracts.Proto.User.UserGetCredentialsByIdRequest,
  ): Promise<Contracts.Proto.User.UserGetCredentialsByIdResponse> {
    const query = new GetCredentialsByIdQuery(request.id);
    const credentials = await this.queryBus.execute(query);
    if (!credentials)
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Credentials not found for user ${request.id}`,
      });
    return { passwordHash: credentials.passwordHash };
  }
}
