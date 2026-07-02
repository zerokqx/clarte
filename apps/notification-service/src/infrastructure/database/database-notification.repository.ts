import { INotificationRepository } from '@/application/ports';
import { Notification } from '@/domain';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationOrmEntity } from './entites';
import { Repository } from 'typeorm';

export class DatabaseNotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly repository: Repository<NotificationOrmEntity>,
  ) {}

  async save(notification: Notification): Promise<void> {
    const plain = notification.toPlain();
    await this.repository.save({
      id: plain.id,
      userId: plain.userId,
      title: plain.title,
      text: plain.text,
      isRead: plain.isRead,
      createdAt: new Date(plain.createdAt),
    });
  }

  async getById(id: string): Promise<Notification | null> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) return null;
    return Notification.restore(
      entity.id,
      entity.userId,
      entity.title,
      entity.text,
      entity.isRead,
      entity.createdAt,
    );
  }

  async getByUserId(userId: string): Promise<Notification[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) =>
      Notification.restore(
        entity.id,
        entity.userId,
        entity.title,
        entity.text,
        entity.isRead,
        entity.createdAt,
      ),
    );
  }
}
