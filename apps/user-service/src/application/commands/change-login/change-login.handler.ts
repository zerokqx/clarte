import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeLoginCommand } from './change-login.command';
import { InjectUserRepository } from '@/application/decorators';
import { type IUserWriteRepository } from '@/application/ports';
import { Effect, pipe } from 'effect';
import { UserNotFound, DbError } from '@/application/exceptions';

@CommandHandler(ChangeLoginCommand)
export class ChangeLoginHandler implements ICommandHandler<ChangeLoginCommand> {
  constructor(
    @InjectUserRepository('w')
    private readonly writeRepo: IUserWriteRepository,
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
        Effect.tryPromise({
          try: () => this.writeRepo.save(user),
          catch: () => new DbError('Не удалось обновить логин в базе данных'),
        }),
      ),
    );

    await Effect.runPromiseExit(program);
  }
}
