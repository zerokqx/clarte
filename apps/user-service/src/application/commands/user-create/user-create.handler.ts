import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  type IUserAvatarGenerator,
  type IUserWriteRepository,
} from '@/application/ports';
import { UserCreateCommand } from '@/application/commands/user-create/user-create.command';
import { User } from '@/domain';
import {
  InjectUserAvatarGenerator,
  InjectUserRepository,
} from '@/application/decorators';

@CommandHandler(UserCreateCommand)
export class UserCreateHandler implements ICommandHandler<UserCreateCommand> {
  constructor(
    @InjectUserRepository('w')
    private readonly repoWrite: IUserWriteRepository,
    @InjectUserAvatarGenerator()
    private readonly userAvatarGenerator: IUserAvatarGenerator,
  ) {}

  async execute(command: UserCreateCommand): Promise<void> {
    const user = User.create(
      command.id,
      command.login,
      command.passwordHash,
      this.userAvatarGenerator.generate(command.login),
    );
    await this.repoWrite.save(user);
    return;
  }
}
