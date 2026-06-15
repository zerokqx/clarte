import { Contracts } from '@clarte/shared-contracts';
import { QueryBus } from '@nestjs/cqrs';
import { FindUserByIdQuery, FindUserByLoginQuery } from '@/application';
import { UserFindByIdDTO, UserFindByLoginDTO } from '@/presentation/dtos';

@Contracts.Proto.User.UserFindServiceControllerMethods()
export class UserFindRpcController
  implements Contracts.Proto.User.UserFindServiceController
{
  constructor(private readonly queryBus: QueryBus) {}
  async findById(
    request: Contracts.Proto.User.UserFindByIdRequest,
  ): Promise<UserFindByIdDTO> {
    const query = new FindUserByIdQuery(request.id);
    const user = await this.queryBus.execute(query);

    return new UserFindByIdDTO({
      avatarUrl: user.avatarUrl,
      id: user.id,
      login: user.login,
    });
  }
  async findByLogin(
    request: Contracts.Proto.User.UserFindByLoginRequest,
  ): Promise<UserFindByLoginDTO> {
    const query = new FindUserByLoginQuery(request.login);
    const user = await this.queryBus.execute(query);
    return new UserFindByLoginDTO({
      avatarUrl: user.avatarUrl,
      id: user.id,
      login: user.login,
    });
  }
}
