import { ITodoClient, InjectTodoGrpcClient } from '@/app/todo/application';
import { OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { Todo } from '@clarte/shared-contracts/proto';
import { map, Observable } from 'rxjs';
import { makeGrpcMetadata } from '@clarte/shared-nest/core/functions';

export class TodoClient implements ITodoClient, OnModuleInit {
  private todoService!: Todo.TodoServiceClient;

  constructor(@InjectTodoGrpcClient() private readonly todoGrpcClient: ClientGrpc) {}

  onModuleInit() {
    this.todoService = this.todoGrpcClient.getService(Todo.TODO_SERVICE_NAME);
  }

  createTodo(userId: string, data: Todo.CreateTodoRequest): Observable<Todo.CreateTodoResponse> {
    return this.todoService.createTodo(data, makeGrpcMetadata({ userId }));
  }

  updateTodo(userId: string, data: Todo.UpdateTodoRequest): Observable<void> {
    return this.todoService.updateTodo(data, makeGrpcMetadata({ userId })).pipe(map(() => void 0));
  }

  completeTodo(userId: string, data: Todo.CompleteTodoRequest): Observable<void> {
    return this.todoService
      .completeTodo(data, makeGrpcMetadata({ userId }))
      .pipe(map(() => void 0));
  }

  uncompleteTodo(userId: string, data: Todo.UncompleteTodoRequest): Observable<void> {
    return this.todoService
      .uncompleteTodo(data, makeGrpcMetadata({ userId }))
      .pipe(map(() => void 0));
  }

  deleteTodo(userId: string, data: Todo.DeleteTodoRequest): Observable<void> {
    return this.todoService.deleteTodo(data, makeGrpcMetadata({ userId })).pipe(map(() => void 0));
  }

  getUserTodos(userId: string): Observable<Todo.GetUserTodsResponse> {
    return this.todoService.getUserTodos({}, makeGrpcMetadata({ userId }));
  }
}
