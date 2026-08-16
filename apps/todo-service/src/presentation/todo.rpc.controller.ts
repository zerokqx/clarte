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
import { Metadata } from '@grpc/grpc-js';
import { getUserIdFromGrpcMetadata } from '@clarte/shared-nest/functions';

@Todo.TodoServiceControllerMethods()
@Controller()
export class TodoRpcController implements Todo.TodoServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createTodo(
    request: Todo.CreateTodoRequest,
    metadata?: Metadata,
  ): Promise<Todo.CreateTodoResponse> {
    const userId = getUserIdFromGrpcMetadata(metadata);
    return this.commandBus.execute(new CreateTodoCommand({ userId, data: { ...request, userId } }));
  }

  async updateTodo(request: Todo.UpdateTodoRequest, metadata?: Metadata): Promise<void> {
    const userId = getUserIdFromGrpcMetadata(metadata);
    await this.commandBus.execute(new UpdateTodoCommand({ ...request, user_id: userId }));
    return {} as unknown as void;
  }

  async completeTodo(request: Todo.CompleteTodoRequest, metadata?: Metadata): Promise<void> {
    const userId = getUserIdFromGrpcMetadata(metadata);
    await this.commandBus.execute(
      new CompleteTodoCommand({
        todoId: request.id,
        userId,
      }),
    );
    return {} as unknown as void;
  }

  async uncompleteTodo(request: Todo.UncompleteTodoRequest, metadata?: Metadata): Promise<void> {
    const userId = getUserIdFromGrpcMetadata(metadata);
    await this.commandBus.execute(
      new UncompleteTodoCommand({
        todoId: request.id,
        userId,
      }),
    );
    return {} as unknown as void;
  }

  async getUserTodos(_request: unknown, metadata?: Metadata): Promise<Todo.GetUserTodsResponse> {
    const userId = getUserIdFromGrpcMetadata(metadata);
    const todos = await this.queryBus.execute(new GetUserTodosQuery(userId));

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

  async deleteTodo(request: Todo.DeleteTodoRequest, metadata?: Metadata): Promise<void> {
    const userId = getUserIdFromGrpcMetadata(metadata);
    await this.commandBus.execute(new DeleteCommand({ userId, todoId: request.id }));
    return voidObject();
  }
}
