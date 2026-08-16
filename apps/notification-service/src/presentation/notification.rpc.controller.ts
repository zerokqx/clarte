import { Controller } from '@nestjs/common';
import { Notification } from '@clarte/shared-contracts/proto';
import { QueryBus } from '@nestjs/cqrs';
import { GetNotificationsQuery } from '@/application/queries/get-notifications';
import { Metadata } from '@grpc/grpc-js';
import { getUserIdFromGrpcMetadata } from '@clarte/shared-nest/core/functions';

@Controller()
@Notification.NotificationServiceControllerMethods()
export class NotificationRpcController implements Notification.NotificationServiceController {
  constructor(private readonly queryBus: QueryBus) {}

  async getNotificationsById(
    _request: unknown,
    metadata?: Metadata,
  ): Promise<Notification.GetNotificationsByIdResponse> {
    const userId = getUserIdFromGrpcMetadata(metadata);
    const notifications = await this.queryBus.execute(new GetNotificationsQuery(userId));
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
