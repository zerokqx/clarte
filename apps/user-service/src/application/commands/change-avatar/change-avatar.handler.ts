import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeAvatarCommand } from './change-avatar.command';
import {
  InjectUserRepository,
  InjectUserAvatarGenerator,
} from '@/application/decorators';
import {
  type IUserWriteRepository,
  type IUserAvatarGenerator,
} from '@/application/ports';
import { Effect, pipe } from 'effect';
import { UserNotFound } from '@/application/exceptions';
import { CouldntSaveProfileError } from '@/application/exceptions/couldnt-save-profile.exception';

@CommandHandler(ChangeAvatarCommand)
export class ChangeAvatarHandler
  implements ICommandHandler<ChangeAvatarCommand>
{
  constructor(
    @InjectUserRepository('w')
    private readonly domainRepo: IUserWriteRepository,
    @InjectUserAvatarGenerator()
    private readonly userAvatarGenerator: IUserAvatarGenerator,
  ) {}

  async execute(command: ChangeAvatarCommand): Promise<void> {
    const program = pipe(
      Effect.tryPromise({
        try: () => this.domainRepo.findUserById(command.id),
        catch: () => new UserNotFound('User not found'),
      }),
      Effect.tap((user) => {
        const defaultAvatar = this.userAvatarGenerator.generate(user.login);
        user.changeAvatar(command.avatarUrl, defaultAvatar);
      }),
      Effect.flatMap((user) =>
        Effect.tryPromise({
          try: () => this.domainRepo.save(user),
          catch: () =>
            new CouldntSaveProfileError(
              "Couldn't save profile, please try again later",
            ),
        }),
      ),
    );

    await Effect.runPromise(program);
  }
}
