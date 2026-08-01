import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INotificationWriteRepository } from '@/application/ports';
import { Notification } from '@/domain';
import { NotificationOrmEntity } from './entites';
import { NotificationMapper } from '../mappers';

@Injectable()
export class NotificationWriteRepository implements INotificationWriteRepository {
  private readonly mapper = new NotificationMapper();

  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly repository: Repository<NotificationOrmEntity>,
  ) {}

  async save(notification: Notification): Promise<void> {
    const ormEntity = this.mapper.toPersistence(notification);
    await this.repository.save(ormEntity);
  }

  async getById(id: string): Promise<Notification | null> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) return null;
    return this.mapper.toDomain({
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      text: entity.text,
      isRead: entity.isRead,
      createdAt: entity.createdAt.toISOString(),
    });
  }
}
