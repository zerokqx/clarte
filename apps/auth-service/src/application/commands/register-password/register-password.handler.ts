import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterPasswordCommand } from '@/application/commands/register-password/register-password.command';
import { Cause, Effect, Exit, pipe } from 'effect';
import { InjectPasswordHasher, InjectUserClient } from '@/application/decorators';
import { type IUserClient } from '@/application/ports';
import {
  UserAlreadyExistsException,
  UserServiceUnavailableException,
} from '@/application/exceptions';
import { type IPasswordHasher } from '@/domain';
import { randomUUID } from 'crypto';
import { E } from '@clarte/shared';

@CommandHandler(RegisterPasswordCommand)
export class RegisterPasswordHandler implements ICommandHandler<RegisterPasswordCommand> {
  constructor(
    @InjectUserClient() private readonly userClient: IUserClient,
    @InjectPasswordHasher() private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(command: RegisterPasswordCommand): Promise<void> {
    const exit = await pipe(
      Effect.tryPromise({
        try: () => this.userClient.findUserByLogin(command.login),
        catch: (error) => error,
      }),
      Effect.catchAll((error) => {
        if (error && E.errorCode()(error) === 5) {
          return Effect.succeed(null);
        }
        return Effect.fail(
          new UserServiceUnavailableException(`User service is currently unavailable`),
        );
      }),
      Effect.flatMap((user) => {
        if (user !== null) {
          return Effect.fail(
            new UserAlreadyExistsException(`User ${command.login} already exists`),
          );
        }
        return Effect.succeed(undefined);
      }),
      Effect.flatMap(() =>
        Effect.tryPromise({
          try: async () => {
            const userId = randomUUID();
            const passwordHash = await this.passwordHasher.hash(command.password);
            await this.userClient.createUser(userId, command.login, passwordHash);
          },
          catch: (error) =>
            new UserServiceUnavailableException(
              `Failed to create user: ${E.errorMessage(error)('Unknown error')}`,
            ),
        }),
      ),
      Effect.runPromiseExit,
    );

    return Exit.match(exit, {
      onFailure: (cause) => {
        throw Cause.squash(cause);
      },
      onSuccess: () => void 0,
    });
  }
}
