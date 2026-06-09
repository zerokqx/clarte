import { Contracts } from '@clarte/shared';
import { QueryBus } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { FindUserByIdQuery } from '../application/queries/find-by-id/find-user-by-id.query';
import { FindUserByLoginQuery } from '../application/queries/find-by-login/find-user-by-login.query';
import { UserRpcMapper } from '../infrastructure/mappers/user-rpc.mapper';

@Contracts.Proto.User.UserFindServiceControllerMethods()
export class UserFindRpcController
  implements Contracts.Proto.User.UserFindServiceController
{
  constructor(private readonly queryBus: QueryBus) {}
  async findById(
    request: Contracts.Proto.User.UserFindByIdRequest,
  ): Promise<Contracts.Proto.User.User> {
    const query = new FindUserByIdQuery(request.id);
    const user = await this.queryBus.execute(query);
    if (!user)
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `User with ID ${request.id} not found`,
      });
    return UserRpcMapper.toRpc(user);
  }
  async findByLogin(
    request: Contracts.Proto.User.UserFindByLoginRequest,
  ): Promise<Contracts.Proto.User.User> {
    const query = new FindUserByLoginQuery(request.login);
    const user = await this.queryBus.execute(query);
    if (!user)
      throw new RpcException({
        code: status.NOT_FOUND,

        message: `User with login ${request.login} not found`,
      });
    return UserRpcMapper.toRpc(user);
  }
}
