import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { INotificationReadRepository } from '@/application/ports';
import { NotificationReadModel } from '@/application/models';
import { NotificationOrmEntity } from './entites';
import { NotificationMapper } from '../mappers';

@Injectable()
export class NotificationReadRepository implements INotificationReadRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getByUserId(userId: string): Promise<NotificationReadModel[]> {
    const entities = await this.dataSource.getRepository(NotificationOrmEntity).find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => NotificationMapper.toReadModel(entity));
  }
}
