import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Notification } from '@clarte/shared-contracts/proto';
import { InjectNotificationRepo } from '@/application/decorators';
import { INotificationRepository } from '@/application/ports';
import { Notification as NotificationDomain } from '@/domain';
import { randomUUID } from 'crypto';
import {
  UserEventPattern,
  type IUserCreatedPayload,
  type IUserEnteredPayload,
} from '@clarte/shared-event-types/user';
import { TodoEventPattern, type ITodoReminderPayload } from '@clarte/shared-event-types/todo';
import { QueryBus } from '@nestjs/cqrs';
import { GetNotificationsQuery } from '@/application/queries/get-notifications';
import { CqrsRepoType } from '@clarte/shared-nest/types';

@Controller()
@Notification.NotificationServiceControllerMethods()
export class NotificationRpcController implements Notification.NotificationServiceController {
  private readonly logger = new Logger(NotificationRpcController.name);

  constructor(
    private readonly queryBus: QueryBus,
    @InjectNotificationRepo(CqrsRepoType.w)
    private readonly writeRepo: INotificationRepository[CqrsRepoType.w],
  ) {}

  // 1. gRPC Handler (implementation of NotificationService)
  async getNotificationsById(
    request: Notification.GetNotificationsByIdRequest,
  ): Promise<Notification.GetNotificationsByIdResponse> {
    const notifications = await this.queryBus.execute(
      new GetNotificationsQuery(request.userId),
    );
    return {
      notifications: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        text: n.text,
        createdAt: n.createdAt,
      })),
    };
  }

  // 2. RMQ Handler for the "user.created" event
  @EventPattern(UserEventPattern.UserCreated)
  async handleUserCreated(@Payload() data: IUserCreatedPayload) {
    try {
      this.logger.log(`Received RMQ Event "user.created" for user: ${data.userId}`);

      // Construct a new Notification using the DDD aggregate root rules
      const notification = NotificationDomain.create({
        id: randomUUID(),
        userId: data.userId,
        title: 'Добро пожаловать!',
        text: `Привет, ${data.login || 'пользователь'}! Ваш аккаунт успешно создан.`,
      });

      // Save the notification to PostgreSQL using the DDD repository port/adapter
      await this.writeRepo.save(notification);
      this.logger.log(`Welcome notification for user ${data.userId} successfully saved to DB.`);
    } catch (err) {
      this.logger.error(
        `Failed to process user.created event for user ${data.userId}: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  // 3. RMQ Handler for the "user.entered" event
  @EventPattern(UserEventPattern.UserEntered)
  async handleUserEntered(@Payload() data: IUserEnteredPayload) {
    try {
      this.logger.log(`Received RMQ Event "user.entered" for user: ${data.userId}`);

      // Construct a new Notification using the DDD aggregate root rules
      const notification = NotificationDomain.create({
        id: randomUUID(),
        userId: data.userId,
        title: 'Новый вход в аккаунт',
        text: `Обнаружен новый вход в ваш аккаунт. Устройство/Браузер: ${data.userAgent || 'Неизвестно'}.`,
      });

      // Save the notification to PostgreSQL using the DDD repository port/adapter
      await this.writeRepo.save(notification);
      this.logger.log(`Login notification for user ${data.userId} successfully saved to DB.`);
    } catch (err) {
      this.logger.error(
        `Failed to process user.entered event for user ${data.userId}: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  // 4. RMQ Handler for the "todo.reminder" event
  @EventPattern(TodoEventPattern.TodoReminder)
  async handleTodoReminder(@Payload() data: ITodoReminderPayload) {
    try {
      this.logger.log(
        `Received RMQ Event "todo.reminder" for user: ${data.userId}, todo: ${data.todoId}`,
      );

      // Construct a new Notification using the DDD aggregate root rules
      const notification = NotificationDomain.create({
        id: randomUUID(),
        userId: data.userId,
        title: 'Уведомление о задаче',
        text: `Время выполнить задачу: ${data.title}`,
      });

      // Save the notification to PostgreSQL using the DDD repository port/adapter
      await this.writeRepo.save(notification);
      this.logger.log(`Reminder notification for user ${data.userId} successfully saved to DB.`);
    } catch (err) {
      this.logger.error(
        `Failed to process todo.reminder event for user ${data.userId}, todo ${data.todoId}: ${err instanceof Error ? err.message : err}`,
      );
    }
  }
}
