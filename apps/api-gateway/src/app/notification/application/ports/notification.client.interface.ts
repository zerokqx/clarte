import { Notification } from '@clarte/shared-contracts/proto';
import { Observable } from 'rxjs';

export interface INotificationClient {
  getNotificationsById(
    userId: string,
  ): Observable<Notification.GetNotificationsByIdResponse>;
}
