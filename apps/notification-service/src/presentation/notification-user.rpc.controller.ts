import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  UserEventPattern,
  UserEventPayloadMap,
  type IUserCreatedPayload,
  type IUserEnteredPayload,
} from '@clarte/shared-event-types/user';
import { CommandBus } from '@nestjs/cqrs';
import { CreateNotifyCommand } from '@/application/commands/create-notify';

@Controller()
export class NotificationUserRpcController {
  private readonly logger = new Logger(NotificationUserRpcController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(UserEventPattern.UserCreated)
  async handleUserCreated(@Payload() data: IUserCreatedPayload) {
    try {
      this.logger.log(`Received RMQ Event "user.created" for user: ${data.userId}`);
      await this.commandBus.execute(
        new CreateNotifyCommand({
          userId: data.userId,
          title: 'Добро пожаловать!',
          text: `Привет, ${data.login || 'пользователь'}! Ваш аккаунт успешно создан.`,
        }),
      );
    } catch (err) {
      this.logger.error(
        `Failed to process user.created event for user ${data.userId}: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  @EventPattern(UserEventPattern.UserChangeLogin)
  async handleUserLoginChanged(
    @Payload() data: UserEventPayloadMap[UserEventPattern.UserChangeLogin],
  ) {
    try {
      this.logger.log(`Received RMQ Event "user.change-login" for user: ${data.userId}`);
      await this.commandBus.execute(
        new CreateNotifyCommand({
          userId: data.userId,
          title: 'Информационное оповещение',
          text: `Ваш логин успешно изменен на ${data.newLogin}`,
        }),
      );
    } catch (err) {
      this.logger.error(
        `Failed to process user.change-login event for user ${data.userId}: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  @EventPattern(UserEventPattern.UserEntered)
  async handleUserEntered(@Payload() data: IUserEnteredPayload) {
    try {
      this.logger.log(`Received RMQ Event "user.entered" for user: ${data.userId}`);
      await this.commandBus.execute(
        new CreateNotifyCommand({
          userId: data.userId,
          title: 'Новый вход в аккаунт',
          text: `Обнаружен новый вход в ваш аккаунт. Устройство/Браузер: ${data.userAgent || 'Неизвестно'}.`,
        }),
      );
    } catch (err) {
      this.logger.error(
        `Failed to process user.entered event for user ${data.userId}: ${err instanceof Error ? err.message : err}`,
      );
    }
  }
}
