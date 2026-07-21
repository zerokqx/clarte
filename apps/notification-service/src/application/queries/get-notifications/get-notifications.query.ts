import { Query } from '@nestjs/cqrs';
import { NotificationReadModel } from '@/application/models';

export class GetNotificationsQuery extends Query<NotificationReadModel[]> {
  constructor(public readonly userId: string) {
    super();
  }
}
