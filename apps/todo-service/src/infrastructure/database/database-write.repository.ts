import { ITodoWriteRepository } from '@/application';
import { Todo } from '@/domain';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoOrmEntity } from './entites';
import { Repository } from 'typeorm';
import { TodoMapper } from '../mappers/todo.mapper';

export class TodoWriteRepository implements ITodoWriteRepository {
  constructor(
    @InjectRepository(TodoOrmEntity)
    private readonly todoRepository: Repository<TodoOrmEntity>,
    private readonly todoMapper: TodoMapper,
  ) {}
  async save(todo: Todo): Promise<void> {
    const persistence = this.todoMapper.toPersistence(todo);
    await this.todoRepository.save(persistence);
  }
  async getById(id: string): Promise<Todo | null> {
    const entity = await this.todoRepository.findOneBy({ id });
    if (!entity) return null;
    return this.todoMapper.toDomain(entity);
  }
  async getTodoByIdAndUserId(todoId: string, userId: string): Promise<Todo | null> {
    const entity = await this.todoRepository.findOneBy({ userId, id: todoId });
    if (!entity) return null;
    return this.todoMapper.toDomain(entity);
  }
}
