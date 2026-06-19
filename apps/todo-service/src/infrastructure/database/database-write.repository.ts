import { ITodoWriteRepository } from '@/application';
import { Todo } from '@/domain';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoOrmEntity } from './entites';
import { Repository } from 'typeorm';

export class TodoWriteRepository implements ITodoWriteRepository {
  constructor(
    @InjectRepository(TodoOrmEntity)
    private readonly todoRepository: Repository<TodoOrmEntity>,
  ) {}
  async save(todo: Todo): Promise<void> {
    const plain = todo.toPlain();
    await this.todoRepository.save({
      id: plain.id,
      userId: plain.userId,
      isCompleted: plain.isCompleted,
      title: plain.title,
      description: plain.description,
      dueDate: new Date(plain.dueDate),
      createdAt: new Date(plain.createdAt),
      updatedAt: new Date(plain.updatedAt),
    });
  }
  async getById(id: string): Promise<Todo | null> {
    const entity = await this.todoRepository.findOneBy({ id });
    if (!entity) return null;
    return Todo.restore(
      entity.id,
      entity.userId,
      entity.isCompleted,
      entity.title,
      entity.description,
      entity.dueDate,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
