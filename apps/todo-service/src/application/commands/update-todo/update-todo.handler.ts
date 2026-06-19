import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTodoCommand } from './update-todo.command';
import { InjectTodoRepo } from '@/application/decorators';
import { ITodoWriteRepository } from '@/application/ports';
import { TodoNotFoundException } from '@/domain/exceptions';

@CommandHandler(UpdateTodoCommand)
export class UpdateTodoHandler implements ICommandHandler<UpdateTodoCommand> {
  constructor(
    @InjectTodoRepo('w')
    private readonly repoWrite: ITodoWriteRepository,
  ) {}

  async execute(command: UpdateTodoCommand): Promise<void> {
    const { data } = command;
    const todo = await this.repoWrite.getById(data.id);
    if (!todo) {
      throw new TodoNotFoundException();
    }

    if (todo.userId !== data.userId) {
      throw new TodoNotFoundException();
    }

    if (data.title !== undefined && data.title !== null) {
      todo.changeTitle(data.title);
    }

    if (data.description !== undefined && data.description !== null) {
      todo.changeDescription(data.description);
    }

    if (data.dueDate !== undefined && data.dueDate !== null) {
      todo.changeDueDate(new Date(data.dueDate));
    }

    if (data.isCompleted !== undefined && data.isCompleted !== null) {
      todo.changeIsCompleted(data.isCompleted);
    }

    await this.repoWrite.save(todo);
  }
}
