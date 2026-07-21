import { Controller } from '@nestjs/common';
import { Notification } from '@clarte/shared-contracts/proto';
import { QueryBus } from '@nestjs/cqrs';
import { GetNotificationsQuery } from '@/application/queries/get-notifications';

@Controller()
@Notification.NotificationServiceControllerMethods()
export class NotificationRpcController implements Notification.NotificationServiceController {
  constructor(private readonly queryBus: QueryBus) {}

  async getNotificationsById(
    request: Notification.GetNotificationsByIdRequest,
  ): Promise<Notification.GetNotificationsByIdResponse> {
    const notifications = await this.queryBus.execute(new GetNotificationsQuery(request.userId));
    return {
      notifications: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        text: n.text,
        createdAt: n.createdAt,
      })),
    };
  }
}
