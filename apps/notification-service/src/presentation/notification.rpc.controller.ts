import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { Notification } from '@clarte/shared-contracts/proto';
import { InjectNotificationRepo } from '@/application/decorators';
import type { INotificationRepository } from '@/application/ports';
import { Notification as NotificationDomain } from '@/domain';
import { randomUUID } from 'crypto';
import { UserEventPattern, type IUserCreatedPayload, type IUserEnteredPayload } from '@clarte/shared-event-types/user';
import { TodoEventPattern, type ITodoReminderPayload } from '@clarte/shared-event-types/todo';

@Controller()
@Notification.NotificationServiceControllerMethods()
export class NotificationRpcController implements Notification.NotificationServiceController {
  private readonly logger = new Logger(NotificationRpcController.name);

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
      this.logger.log(`Received RMQ Event "user.created" for user: ${data.userId}`);

      // Construct a new Notification using the DDD aggregate root rules
      const notification = NotificationDomain.create(
        randomUUID(),
        data.userId,
        'Добро пожаловать!',
        `Привет, ${data.login || 'пользователь'}! Ваш аккаунт успешно создан.`,
      );

      // Save the notification to PostgreSQL using the DDD repository port/adapter
      await this.notificationRepository.save(notification);
      this.logger.log(`Welcome notification for user ${data.userId} successfully saved to DB.`);
    } catch (err) {
      this.logger.error(`Failed to process user.created event for user ${data.userId}: ${err instanceof Error ? err.message : err}`);
    }
  }

  // 3. RMQ Handler for the "user.entered" event
  @EventPattern(UserEventPattern.UserEntered)
  async handleUserEntered(
    @Payload() data: IUserEnteredPayload,
    @Ctx() context: RmqContext,
  ) {
    try {
      this.logger.log(`Received RMQ Event "user.entered" for user: ${data.userId}`);

      // Construct a new Notification using the DDD aggregate root rules
      const notification = NotificationDomain.create(
        randomUUID(),
        data.userId,
        'Новый вход в аккаунт',
        `Обнаружен новый вход в ваш аккаунт. Устройство/Браузер: ${data.userAgent || 'Неизвестно'}.`,
      );

      // Save the notification to PostgreSQL using the DDD repository port/adapter
      await this.notificationRepository.save(notification);
      this.logger.log(`Login notification for user ${data.userId} successfully saved to DB.`);
    } catch (err) {
      this.logger.error(`Failed to process user.entered event for user ${data.userId}: ${err instanceof Error ? err.message : err}`);
    }
  }

  // 4. RMQ Handler for the "todo.reminder" event
  @EventPattern(TodoEventPattern.TodoReminder)
  async handleTodoReminder(
    @Payload() data: ITodoReminderPayload,
    @Ctx() context: RmqContext,
  ) {
    try {
      this.logger.log(`Received RMQ Event "todo.reminder" for user: ${data.userId}, todo: ${data.todoId}`);

      // Construct a new Notification using the DDD aggregate root rules
      const notification = NotificationDomain.create(
        randomUUID(),
        data.userId,
        'Уведомление о задаче',
        `Время выполнить задачу: ${data.title}`,
      );

      // Save the notification to PostgreSQL using the DDD repository port/adapter
      await this.notificationRepository.save(notification);
      this.logger.log(`Reminder notification for user ${data.userId} successfully saved to DB.`);
    } catch (err) {
      this.logger.error(`Failed to process todo.reminder event for user ${data.userId}, todo ${data.todoId}: ${err instanceof Error ? err.message : err}`);
    }
  }
}
