import { Todo } from '@clarte/shared-contracts/proto';
import { Observable } from 'rxjs';

export interface ITodoClient {
  createTodo(userId: string, data: Todo.CreateTodoRequest): Observable<Todo.CreateTodoResponse>;
  updateTodo(userId: string, data: Todo.UpdateTodoRequest): Observable<void>;
  getUserTodos(userId: string): Observable<Todo.GetUserTodsResponse>;
  completeTodo(userId: string, data: Todo.CompleteTodoRequest): Observable<void>;
  uncompleteTodo(userId: string, data: Todo.UncompleteTodoRequest): Observable<void>;
  deleteTodo(userId: string, data: Todo.DeleteTodoRequest): Observable<void>;
}
