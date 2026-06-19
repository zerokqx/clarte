import { Query } from '@nestjs/cqrs';
import { TodoReadModel } from '../../models';

export class GetUserTodosQuery extends Query<TodoReadModel[]> {
  constructor(readonly userId: string) {
    super();
  }
}
