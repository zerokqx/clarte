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
import { lastValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';
import { Effect } from 'effect';

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

    const eventProgram = Effect.tryPromise({
      try: () =>
        lastValueFrom(
          this.rmqClient.emit(UserEventPattern.UserCreated, {
            userId: user.id,
            login: user.login,
          } satisfies UserEventPayloadMap[UserEventPattern.UserCreated]),
        ),
      catch: (error) => error,
    }).pipe(
      Effect.catchAll((error) => {
        this.logger.error('❌ Failed to emit user.created event:', error);
        return Effect.void;
      }),
    );

    Effect.runFork(eventProgram);

    return;
  }
}
