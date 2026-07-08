import { type CrqsRepository } from '@clarte/shared-nest/types';
import { Todo } from '@/domain';
import { TodoReadModel } from '../models';

export interface ITodoReadRepository {
  getTodoById(id: string): Promise<TodoReadModel | null>;
  getAllTodosByUserId(userId: string): Promise<TodoReadModel[]>;
}

export interface ITodoWriteRepository {
  save(todo: Todo): Promise<void>;
  getById(id: string): Promise<Todo | null>;
  getTodoByIdAndUserId(todoId: string, userId: string): Promise<Todo | null>;
}

export type ITodoRepository = CrqsRepository<ITodoReadRepository, ITodoWriteRepository>;
