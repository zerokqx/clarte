import { Todo } from '@clarte/shared-contracts/proto';
import { Command } from '@nestjs/cqrs';

export class CreateTodoCommand extends Command<Todo.CreateTodoResponse> {
  constructor(
    readonly userId: string,
    readonly data: Todo.CreateTodoRequest,
  ) {
    super();
  }
}
