import { Notification } from '@/domain';

export interface INotificationRepository {
  save(notification: Notification): Promise<void>;
  getById(id: string): Promise<Notification | null>;
  getByUserId(userId: string): Promise<Notification[]>;
}
