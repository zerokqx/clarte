import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { Notification } from '@clarte/shared-contracts/proto';
import { InjectNotificationRepo } from '@/application/decorators';
import { INotificationRepository } from '@/application/ports';
import { Notification as NotificationDomain } from '@/domain';
import { randomUUID } from 'crypto';
import { UserEventPattern, type IUserCreatedPayload } from '@clarte/shared-event-types/user';

@Controller()
@Notification.NotificationServiceControllerMethods()
export class NotificationRpcController implements Notification.NotificationServiceController {
  constructor(
    @InjectNotificationRepo()
    private readonly notificationRepository: INotificationRepository,
  ) {}

  // 1. gRPC Handler (implementation of NotificationService)
  async getNotificationsById(
    request: Notification.GetNotificationsByIdRequest,
  ): Promise<Notification.GetNotificationsByIdResponse> {
    const notifications = await this.notificationRepository.getByUserId(request.userId);
    return {
      notifications: notifications.map((n) => {
        const plain = n.toPlain();
        return {
          id: plain.id,
          title: plain.title,
          text: plain.text,
          createdAt: plain.createdAt,
        };
      }),
    };
  }

  // 2. RMQ Handler for the "user.created" event
  @EventPattern(UserEventPattern.UserCreated)
  async handleUserCreated(
    @Payload() data: IUserCreatedPayload,
    @Ctx() context: RmqContext,
  ) {
    try {
      console.log('📬 [Notification Service] Received RMQ Event "user.created":', data);

      // Construct a new Notification using the DDD aggregate root rules
      const notification = NotificationDomain.create(
        randomUUID(),
        data.userId,
        'Добро пожаловать!',
        `Привет, ${data.name || 'пользователь'}! Ваш аккаунт успешно создан.`,
      );

      // Save the notification to PostgreSQL using the DDD repository port/adapter
      await this.notificationRepository.save(notification);
      console.log(`💾 Welcome notification for user ${data.userId} successfully saved to DB.`);
    } catch (err) {
      console.error('❌ Failed to process user.created event:', err);
    }
  }
}
