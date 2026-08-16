import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNotificationsQuery } from './get-notifications.query';
import { InjectNotificationRepo } from '@/application/decorators';
import type { INotificationRepository } from '@/application/ports';
import { NotificationReadModel } from '@/application/models';
import { CqrsRepoType } from '@clarte/shared-nest/core/types';

@QueryHandler(GetNotificationsQuery)
export class GetNotificationsHandler implements IQueryHandler<GetNotificationsQuery> {
  constructor(
    @InjectNotificationRepo(CqrsRepoType.r)
    private readonly readRepo: INotificationRepository[CqrsRepoType.r],
  ) {}

  async execute(query: GetNotificationsQuery): Promise<NotificationReadModel[]> {
    return this.readRepo.getByUserId(query.userId);
  }
}
