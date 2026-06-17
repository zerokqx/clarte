import { User } from '@clarte/shared-contracts/proto';
import { CommandBus } from '@nestjs/cqrs';
import { UserCreateCommand } from '@/application/commands/user-create';

@User.UserCreateServiceControllerMethods()
export class UserCreateController
  implements User.UserCreateServiceController
{
  constructor(private readonly commandBuss: CommandBus) {}

  async userCreate(
    request: User.UserCreateRequest,
  ): Promise<void> {
     await this.commandBuss.execute(
      new UserCreateCommand(request.id, request.login, request.passwordHash),
    );
  }
}
