import { CrqsRepository } from '@clarte/shared-nest/types';
import { Notification } from '@/domain';
import { NotificationReadModel } from '@/application/models';

export interface INotificationWriteRepository {
  save(notification: Notification): Promise<void>;
  getById(id: string): Promise<Notification | null>;
}

export interface INotificationReadRepository {
  getByUserId(userId: string): Promise<NotificationReadModel[]>;
}

export type INotificationRepository = CrqsRepository<
  INotificationReadRepository,
  INotificationWriteRepository
>;
