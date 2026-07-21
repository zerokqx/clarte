import { Notification, NotificationPlain } from '@/domain';
import { NotificationOrmEntity } from '../database/entites';
import { NotificationReadModel } from '@/application/models';
import { IMapper } from '@clarte/shared-domain/domain';

export class NotificationMapper implements IMapper<NotificationPlain, NotificationOrmEntity, Notification> {
  public toDomain(raw: NotificationPlain): Notification {
    return Notification.restore({
      id: raw.id,
      userId: raw.userId,
      title: raw.title,
      text: raw.text,
      isRead: raw.isRead,
      createdAt: new Date(raw.createdAt),
    });
  }

  public toPersistence(domain: Notification): NotificationOrmEntity {
    const plain = domain.toPlain();
    const entity = new NotificationOrmEntity();
    entity.id = plain.id; entity.userId = plain.userId;
    entity.title = plain.title;
    entity.text = plain.text;
    entity.isRead = plain.isRead;
    entity.createdAt = new Date(plain.createdAt);
    return entity;
  }

  public static toDomain(entity: NotificationOrmEntity): Notification {
    return Notification.restore({
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      text: entity.text,
      isRead: entity.isRead,
      createdAt: entity.createdAt,
    });
  }

  public static toOrm(domain: Notification): NotificationOrmEntity {
    const plain = domain.toPlain();
    const entity = new NotificationOrmEntity();
    entity.id = plain.id;
    entity.userId = plain.userId;
    entity.title = plain.title;
    entity.text = plain.text;
    entity.isRead = plain.isRead;
    entity.createdAt = new Date(plain.createdAt);
    return entity;
  }

  public static toReadModel(entity: NotificationOrmEntity): NotificationReadModel {
    return new NotificationReadModel(
      entity.id,
      entity.userId,
      entity.title,
      entity.text,
      entity.isRead,
      entity.createdAt.toISOString(),
    );
  }
}
