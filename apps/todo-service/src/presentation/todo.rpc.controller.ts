import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Todo } from '@clarte/shared-contracts/proto';
import {
  CreateTodoCommand,
  UpdateTodoCommand,
  GetUserTodosQuery,
  CompleteTodoCommand,
  UncompleteTodoCommand,
  DeleteCommand,
} from '@/application';
import { voidObject } from '@clarte/shared';

@Todo.TodoServiceControllerMethods()
@Controller()
export class TodoRpcController implements Todo.TodoServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createTodo(request: Todo.CreateTodoRequest): Promise<Todo.CreateTodoResponse> {
    return this.commandBus.execute(
      new CreateTodoCommand({ userId: request.userId, data: request }),
    );
  }

  async updateTodo(request: Todo.UpdateTodoRequest): Promise<void> {
    await this.commandBus.execute(new UpdateTodoCommand(request));
    return {} as unknown as void;
  }

  async completeTodo(request: Todo.CompleteTodoRequest): Promise<void> {
    await this.commandBus.execute(
      new CompleteTodoCommand({
        todoId: request.id,
        userId: request.userId,
      }),
    );
    return {} as unknown as void;
  }

  async uncompleteTodo(request: Todo.UncompleteTodoRequest): Promise<void> {
    await this.commandBus.execute(
      new UncompleteTodoCommand({
        todoId: request.id,
        userId: request.userId,
      }),
    );
    return {} as unknown as void;
  }

  async getUserTodos(request: Todo.GetUserTodosRequest): Promise<Todo.GetUserTodsResponse> {
    const todos = await this.queryBus.execute(new GetUserTodosQuery(request.userId));

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
  async deleteTodo(request: Todo.DeleteTodoRequest): Promise<void> {
    await this.commandBus.execute(
      new DeleteCommand({ userId: request.userId, todoId: request.id }),
    );
    return voidObject();
  }
}
