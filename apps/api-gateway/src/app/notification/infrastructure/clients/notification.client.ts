import { INotificationClient } from '@/app/notification/application';
import { OnModuleInit } from '@nestjs/common';
import { InjectNotificationGrpcClient } from '@/app/notification/infrastructure/notification.decorator';
import { type ClientGrpc } from '@nestjs/microservices';
import { Notification } from '@clarte/shared-contracts/proto';
import { Observable } from 'rxjs';

export class NotificationClient implements INotificationClient, OnModuleInit {
  private notificationService!: Notification.NotificationServiceClient;

  constructor(
    @InjectNotificationGrpcClient() private readonly notificationGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationService = this.notificationGrpcClient.getService<Notification.NotificationServiceClient>(
      Notification.NOTIFICATION_SERVICE_NAME,
    );
  }

  getNotificationsById(userId: string): Observable<Notification.GetNotificationsByIdResponse> {
    return this.notificationService.getNotificationsById({ userId });
  }
}
