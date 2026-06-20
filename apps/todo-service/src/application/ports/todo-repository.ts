import { Todo } from '@/domain';
import { TodoReadModel } from '../models';

export interface ITodoReadRepository {
  getTodoById(id: string): Promise<TodoReadModel | null>;
  getAllTodosByUserId(userId: string): Promise<TodoReadModel[]>;
}

export interface ITodoWriteRepository {
  save(todo: Todo): Promise<void>;
  getById(id: string): Promise<Todo | null>;
}
