import { freezeWith } from '@clarte/shared';
import { Todo } from '@clarte/shared-contracts/proto';
import { Command } from '@nestjs/cqrs';

interface CreateTodoCommandProps {
  readonly userId: string;
  readonly data: Todo.CreateTodoRequest;
}
export class CreateTodoCommand
  extends Command<Todo.CreateTodoResponse>
  implements CreateTodoCommandProps
{
  readonly userId!: string;
  readonly data!: Todo.CreateTodoRequest;
  constructor(props: CreateTodoCommandProps) {
    super();
    freezeWith(this, props);
  }
}
