import { IMapper } from '@clarte/shared-domain/domain';
import { TodoOrmEntity } from '../database';
import { Todo } from '@/domain';

export class TodoMapper implements IMapper<TodoOrmEntity, TodoOrmEntity, Todo> {
  toDomain(raw: TodoOrmEntity): Todo {
    return Todo.restore({
      id: raw.id,
      userId: raw.userId,
      isCompleted: raw.isCompleted,
      title: raw.title,
      description: raw.description,
      dueDate: raw.dueDate,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      isDeleted: raw.isDeleted,
    });
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
      isDeleted: domain.isDeleted,
    };
  }
}
