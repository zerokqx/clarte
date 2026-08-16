import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CompleteTodoCommand } from './complete-todo.command';
import { InjectTodoRepo } from '@/application/decorators';
import { ITodoRepository } from '@/application/ports';
import { CqrsRepoType } from '@clarte/shared-nest/core/types';

@CommandHandler(CompleteTodoCommand)
export class CompleteTodoHandler implements ICommandHandler<CompleteTodoCommand> {
  constructor(@InjectTodoRepo('w') private readonly writeRepo: ITodoRepository[CqrsRepoType.w]) {}
  async execute(command: CompleteTodoCommand): Promise<void> {
    const todo = await this.writeRepo.getTodoByIdAndUserId(command.todoId, command.userId);
    if (!todo) return;
    todo.completed();
    this.writeRepo.save(todo);
  }
}
