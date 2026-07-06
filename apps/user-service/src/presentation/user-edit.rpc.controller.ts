import { ChangeAvatarCommand } from '@/application';
import { ChangeLoginCommand } from '@/application/commands/change-login';
import { User } from '@clarte/shared-contracts/proto';
import { CommandBus } from '@nestjs/cqrs';

@User.UserEditServiceControllerMethods()
export class UserEditController implements User.UserEditServiceController {
  constructor(private readonly commandBus: CommandBus) {}
  async userChangeAvatar(request: User.UserEditChangeAvatarRequest): Promise<void> {
    await this.commandBus.execute(new ChangeAvatarCommand(request.userId, request.avatarUrl));
    return {} as any;
  }

  async userChangeLogin(request: User.UserEditChangeLoginRequest): Promise<void> {
    console.log(request);
    await this.commandBus.execute(
      new ChangeLoginCommand({ login: request.login, userId: request.userId }),
    );
    return {} as never;
  }
}
