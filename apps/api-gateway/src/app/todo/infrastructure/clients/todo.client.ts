import { ITodoClient, InjectTodoGrpcClient } from '@/app/todo/application';
import { OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { Todo } from '@clarte/shared-contracts/proto';
import { map, Observable } from 'rxjs';

export class TodoClient implements ITodoClient, OnModuleInit {
  private todoService!: Todo.TodoServiceClient;

  constructor(@InjectTodoGrpcClient() private readonly todoGrpcClient: ClientGrpc) {}

  onModuleInit() {
    this.todoService = this.todoGrpcClient.getService(Todo.TODO_SERVICE_NAME);
  }

  createTodo(data: Todo.CreateTodoRequest): Observable<Todo.CreateTodoResponse> {
    return this.todoService.createTodo(data);
  }

  updateTodo(data: Todo.UpdateTodoRequest): Observable<void> {
    return this.todoService.updateTodo(data).pipe(map(() => void 0));
  }

  completeTodo(data: Todo.CompleteTodoRequest): Observable<void> {
    return this.todoService.completeTodo(data).pipe(map(() => void 0));
  }

  uncompleteTodo(data: Todo.UncompleteTodoRequest): Observable<void> {
    return this.todoService.uncompleteTodo(data).pipe(map(() => void 0));
  }

  deleteTodo(data: Todo.DeleteTodoRequest): Observable<void> {
    return this.todoService.deleteTodo(data).pipe(map(() => void 0));
  }

  getUserTodos(userId: string): Observable<Todo.GetUserTodsResponse> {
    return this.todoService.getUserTodos({ id: '', userId });
  }
}
