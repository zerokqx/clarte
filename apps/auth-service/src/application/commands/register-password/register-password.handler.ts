import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterPasswordCommand } from './register-password.command';
import { Cause, Effect, Exit, pipe } from 'effect';
import { InjectPasswordHasher, InjectUserClient } from '../../decorators';
import { type IUserClient } from '../../ports';
import {
  UserAlreadyExistsException,
  UserServiceUnavailableException,
} from '../../exceptions';
import { type IPasswordHasher } from '../../../domain';
import { randomUUID } from 'crypto';

@CommandHandler(RegisterPasswordCommand)
export class RegisterPasswordHandler
  implements ICommandHandler<RegisterPasswordCommand>
{
  constructor(
    @InjectUserClient() private readonly userClient: IUserClient,
    @InjectPasswordHasher() private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(command: RegisterPasswordCommand): Promise<void> {
    const exit = await pipe(
      // 1. Проверяем, существует ли уже пользователь
      Effect.tryPromise({
        try: () => this.userClient.findUserByLogin(command.login),
        catch: (error: any) => error,
      }),
      // Сначала ловим gRPC ошибку "NOT_FOUND" от findUserByLogin
      Effect.catchAll((error: any) => {
        if (error && error.code === 5) {
          return Effect.succeed(null);
        }
        return Effect.fail(
          new UserServiceUnavailableException(
            `User service is currently unavailable`,
          ),
        );
      }),
      // Если запрос завершился успешно (вернулся user) или catchAll вернул null
      Effect.flatMap((user) => {
        if (user !== null) {
          return Effect.fail(
            new UserAlreadyExistsException(
              `User ${command.login} already exists`,
            ),
          );
        }
        return Effect.succeed(undefined);
      }),
      // 2. Хешируем пароль и создаем пользователя в user-service
      Effect.flatMap(() =>
        Effect.tryPromise({
          try: async () => {
            const userId = randomUUID();
            const passwordHash = await this.passwordHasher.hash(command.password);
            await this.userClient.createUser(userId, command.login, passwordHash);
          },
          catch: (error: any) =>
            new UserServiceUnavailableException(
              `Failed to create user: ${error.message}`,
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
