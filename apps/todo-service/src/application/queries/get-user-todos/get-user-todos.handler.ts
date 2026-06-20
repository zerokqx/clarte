import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserTodosQuery } from './get-user-todos.query';
import { InjectTodoRepo } from '@/application/decorators';
import { ITodoReadRepository } from '@/application/ports';
import { TodoReadModel } from '../../models';

@QueryHandler(GetUserTodosQuery)
export class GetUserTodosHandler implements IQueryHandler<GetUserTodosQuery> {
  constructor(
    @InjectTodoRepo('r')
    private readonly repoRead: ITodoReadRepository,
  ) {}

  async execute(query: GetUserTodosQuery): Promise<TodoReadModel[]> {
    return this.repoRead.getAllTodosByUserId(query.userId);
  }
}
