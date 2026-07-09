import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCommand } from './delete.command';
import { InjectTodoRepo } from '@/application/decorators';
import { ITodoRepository } from '@/application/ports';
import { CqrsRepoType } from '@clarte/shared-nest/types';

@CommandHandler(DeleteCommand)
export class DeleteHandler implements ICommandHandler<DeleteCommand> {
  constructor(@InjectTodoRepo('w') private readonly writeRepo: ITodoRepository[CqrsRepoType.w]) {}
  async execute(command: DeleteCommand): Promise<void> {
    const entity = this.writeRepo.getTodoByIdAndUserId(command.todoId, command.userId);
  }
}
