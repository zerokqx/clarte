import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UncompleteTodoCommand } from './uncomplete-todo.command';
import { InjectTodoRepo } from '@/application/decorators';
import { ITodoRepository } from '@/application/ports';
import { CqrsRepoType } from '@clarte/shared-nest/core/types';

@CommandHandler(UncompleteTodoCommand)
export class UncompleteTodoHandler implements ICommandHandler<UncompleteTodoCommand> {
  constructor(@InjectTodoRepo('w') private readonly writeRepo: ITodoRepository[CqrsRepoType.w]) {}
  async execute(command: UncompleteTodoCommand): Promise<void> {
    const todo = await this.writeRepo.getTodoByIdAndUserId(command.todoId, command.userId);
    if (!todo) return;
    todo.uncompleted();
    this.writeRepo.save(todo);
  }
}
