import { Todo } from '@clarte/shared-contracts/proto';
import { Command } from '@nestjs/cqrs';

export class UpdateTodoCommand extends Command<void> {
  constructor(readonly data: Todo.UpdateTodoRequest) {
    super();
  }
}
