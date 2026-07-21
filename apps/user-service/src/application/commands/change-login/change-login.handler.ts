import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeLoginCommand } from './change-login.command';
import { InjectUserRepository, InjectUserRmqClient } from '@/application/decorators';
import { type IUserWriteRepository } from '@/application/ports';
import { Effect, pipe } from 'effect';
import { UserNotFound, DbError } from '@/application/exceptions';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@CommandHandler(ChangeLoginCommand)
export class ChangeLoginHandler implements ICommandHandler<ChangeLoginCommand> {
  constructor(
    @InjectUserRepository('w')
    private readonly writeRepo: IUserWriteRepository,
    @InjectUserRmqClient() private readonly userRmqClient: ClientRMQ,
  ) {}

  async execute(command: ChangeLoginCommand): Promise<void> {
    const program = pipe(
      Effect.tryPromise({
        try: () => this.writeRepo.findUserById(command.userId),
        catch: () => new DbError('Не удалось выполнить запрос к базе данных'),
      }),

      Effect.flatMap((user) =>
        user ? Effect.succeed(user) : Effect.fail(new UserNotFound('Пользователь не найден')),
      ),

      Effect.tap((user) => {
        user.changeLogin(command.login);
      }),
      Effect.flatMap((user) =>
        pipe(
          Effect.tryPromise({
            try: () => this.writeRepo.save(user),
            catch: () => new DbError('Не удалось обновить логин в базе данных'),
          }),
          Effect.andThen(() =>
            Effect.all(
              user.domainEvents.map((ev) =>
                Effect.tryPromise(() =>
                  firstValueFrom(this.userRmqClient.emit(ev.eventName, ev.payload)),
                ),
              ),
              { discard: true },
            ),
          ),
        ),
      ),
    );

    const exit = await Effect.runPromiseExit(program);

    if (exit._tag === 'Failure') {
      throw exit.cause;
    }
  }
}
