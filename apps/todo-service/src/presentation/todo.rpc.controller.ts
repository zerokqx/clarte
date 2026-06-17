import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Todo } from '@clarte/shared-contracts/proto';
import {
  CreateTodoCommand,
  UpdateTodoCommand,
  GetUserTodosQuery,
} from '@/application';

@Todo.TodoServiceControllerMethods()
@Controller()
export class TodoRpcController implements Todo.TodoServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createTodo(
    request: Todo.CreateTodoRequest,
  ): Promise<Todo.CreateTodoResponse> {
    return this.commandBus.execute(
      new CreateTodoCommand(request.userId, request),
    );
  }

  async updateTodo(request: Todo.UpdateTodoRequest): Promise<void> {
    await this.commandBus.execute(new UpdateTodoCommand(request));
    return {} as unknown as void;
  }

  async getUserTodos(
    request: Todo.GetUserTodosRequest,
  ): Promise<Todo.GetUserTodsResponse> {
    const todos = await this.queryBus.execute(
      new GetUserTodosQuery(request.userId),
    );

    return {
      todos: todos.map((t) => ({
        id: t.id,
        userId: t.userId,
        title: t.title,
        description: t.description,
        isCompleted: t.isCompleted,
        dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : '',
        createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : '',
        updatedAt: t.updatedAt ? new Date(t.updatedAt).toISOString() : '',
      })),
    };
  }
}
