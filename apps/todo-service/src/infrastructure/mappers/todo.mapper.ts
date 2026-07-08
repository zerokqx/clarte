import { IMapper } from '@clarte/shared-domain/domain';
import { TodoOrmEntity } from '../database';
import { Todo } from '@/domain';

export class TodoMapper implements IMapper<TodoOrmEntity, TodoOrmEntity, Todo> {
  toDomain(raw: TodoOrmEntity): Todo {
    return Todo.restore(
      raw.id,
      raw.userId,
      raw.isCompleted,
      raw.title,
      raw.description,
      raw.dueDate,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  toPersistence(domain: Todo): TodoOrmEntity {
    return {
      createdAt: domain.createdAt,
      description: domain.description,
      dueDate: domain.dueDate,
      isCompleted: domain.isCompleted,
      title: domain.title,
      updatedAt: domain.updatedAt,
      userId: domain.userId,
      id: domain.id,
    };
  }
}
