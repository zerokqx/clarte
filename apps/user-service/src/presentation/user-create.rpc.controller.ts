import { Contracts } from '@clarte/shared-contracts';
import { CommandBus } from '@nestjs/cqrs';
import { UserCreateCommand } from '../application/commands/user-create';

@Contracts.Proto.User.UserCreateServiceControllerMethods()
export class UserCreateController
  implements Contracts.Proto.User.UserCreateServiceController
{
  constructor(private readonly commandBuss: CommandBus) {}

  async userCreate(
    request: Contracts.Proto.User.UserCreateRequest,
  ): Promise<void> {
     await this.commandBuss.execute(
      new UserCreateCommand(request.id, request.login, request.passwordHash),
    );
  }
}
