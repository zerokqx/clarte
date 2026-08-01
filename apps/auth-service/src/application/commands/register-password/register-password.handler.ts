import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterPasswordCommand } from '@/application/commands/register-password/register-password.command';
import { Cause, Effect, Exit, pipe } from 'effect';
import {
  InjectPasswordHasher,
  InjectUserClient,
  InjectAuthRmqClient, // <-- Добавляем инжект RabbitMQ
} from '@/application/decorators';
import { type IUserClient } from '@/application/ports';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  UserAlreadyExistsException,
  UserServiceUnavailableException,
} from '@/application/exceptions';
import { AuthUser, type IPasswordHasher } from '@/domain';
import { randomUUID } from 'crypto';
import { E } from '@clarte/shared';
import { eventToArray } from '@clarte/shared-domain/domain';

@CommandHandler(RegisterPasswordCommand)
export class RegisterPasswordHandler implements ICommandHandler<RegisterPasswordCommand> {
  constructor(
    @InjectUserClient() private readonly userClient: IUserClient,
    @InjectPasswordHasher() private readonly passwordHasher: IPasswordHasher,
    @InjectAuthRmqClient() private readonly rmqClient: ClientProxy,
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

            // 1. Создаем доменную сущность.
            // Внутри отработает хэширование и добавится UserRegisteredEvent
            const user = await AuthUser.create(
              userId,
              command.login,
              command.password,
              this.passwordHasher,
            );

            // 2. Оставляем ваш текущий gRPC-вызов для совместимости
            await this.userClient.createUser(user.id, user.loginValue, user.passwordHash);

            // Прокидываем агрегат дальше по пайплайну
            return user;
          },
          catch: (error) =>
            new UserServiceUnavailableException(
              `Failed to create user: ${E.errorMessage('Unknown error')(error)}`,
            ),
        }),
      ),
      // 3. Публикуем доменные события, которые скопились в агрегате
      Effect.tap((user) =>
        Effect.forEach(user.domainEvents, (ev) =>
          Effect.tryPromise({
            try: () => lastValueFrom(this.rmqClient.emit(...eventToArray(ev))),
            catch: (error) =>
              new Error(`Failed to emit domain event: ${E.errorMessage('Unknown Error')(error)}`),
          }),
        ),
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
