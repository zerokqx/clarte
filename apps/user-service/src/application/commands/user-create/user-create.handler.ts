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
  InjectUserRmqClient,
} from '@/application/decorators';
import { ClientProxy } from '@nestjs/microservices';
import {
  UserEventPattern,
  type UserEventPayloadMap,
} from '@clarte/shared-event-types/user';
import { firstValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';

@CommandHandler(UserCreateCommand)
export class UserCreateHandler implements ICommandHandler<UserCreateCommand> {
  private readonly logger = new Logger(UserCreateHandler.name);
  constructor(
    @InjectUserRepository('w')
    private readonly repoWrite: IUserWriteRepository,
    @InjectUserAvatarGenerator()
    private readonly userAvatarGenerator: IUserAvatarGenerator,
    @InjectUserRmqClient()
    private readonly rmqClient: ClientProxy,
  ) {}

  async execute(command: UserCreateCommand): Promise<void> {
    const user = User.create(
      command.id,
      command.login,
      command.passwordHash,
      this.userAvatarGenerator.generate(command.login),
    );
    await this.repoWrite.save(user);

    // Emit user.created event to RMQ
    await firstValueFrom(
      this.rmqClient.emit(UserEventPattern.UserCreated, {
        userId: user.id,
        login: user.login,
      } satisfies UserEventPayloadMap[UserEventPattern.UserCreated]),
    ).catch((err) => {
      this.logger.error('❌ Failed to emit user.created event:', err);
    });

    return;
  }
}
