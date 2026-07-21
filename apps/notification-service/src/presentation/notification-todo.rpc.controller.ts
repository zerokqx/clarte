import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TodoEventPattern, type ITodoReminderPayload } from '@clarte/shared-event-types/todo';
import { CommandBus } from '@nestjs/cqrs';
import { CreateNotifyCommand } from '@/application/commands/create-notify';

@Controller()
export class NotificationTodoRpcController {
  private readonly logger = new Logger(NotificationTodoRpcController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(TodoEventPattern.TodoReminder)
  async handleTodoReminder(@Payload() data: ITodoReminderPayload) {
    try {
      this.logger.log(
        `Received RMQ Event "todo.reminder" for user: ${data.userId}, todo: ${data.todoId}`,
      );
      await this.commandBus.execute(
        new CreateNotifyCommand({
          userId: data.userId,
          title: 'Уведомление о задаче',
          text: `Время выполнить задачу: ${data.title}`,
        }),
      );
    } catch (err) {
      this.logger.error(
        `Failed to process todo.reminder event for user ${data.userId}, todo ${data.todoId}: ${err instanceof Error ? err.message : err}`,
      );
    }
  }
}
