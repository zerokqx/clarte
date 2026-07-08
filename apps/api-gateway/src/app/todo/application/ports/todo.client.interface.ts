import { Todo } from '@clarte/shared-contracts/proto';
import { Observable } from 'rxjs';

export interface ITodoClient {
  createTodo(data: Todo.CreateTodoRequest): Observable<Todo.CreateTodoResponse>;
  updateTodo(data: Todo.UpdateTodoRequest): Observable<void>;
  getUserTodos(userId: string): Observable<Todo.GetUserTodsResponse>;
  completeTodo(data: Todo.CompleteTodoRequest): Observable<void>;
  uncompleteTodo(data: Todo.UncompleteTodoRequest): Observable<void>;
}
