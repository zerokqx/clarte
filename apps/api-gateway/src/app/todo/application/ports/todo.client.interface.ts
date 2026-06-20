import { Todo } from '@clarte/shared-contracts/proto';
import { Observable } from 'rxjs';

export interface ITodoClient {
  createTodo(data: Todo.CreateTodoRequest): Observable<Todo.CreateTodoResponse>;
  updateTodo(data: Todo.UpdateTodoRequest): Observable<void>;
  getUserTodos(userId: string): Observable<Todo.GetUserTodsResponse>;
}
