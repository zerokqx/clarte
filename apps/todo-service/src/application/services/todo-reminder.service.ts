import { Injectable, Logger } from '@nestjs/common';
import { InjectTodoRepo, InjectTodoRmqClient } from '@/application/decorators';
import { ITodoReadRepository } from '@/application/ports';
import { ClientProxy } from '@nestjs/microservices';
import { TodoEventPattern, type TodoEventPayloadMap } from '@clarte/shared-event-types/todo';
import { firstValueFrom } from 'rxjs';

interface ExecuteProps {
  userId: string;
  todoId: string;
}

@Injectable()
export class TodoReminderService {
  private readonly logger = new Logger(TodoReminderService.name);

  constructor(
    @InjectTodoRepo('r')
    private readonly repoRead: ITodoReadRepository,
    @InjectTodoRmqClient()
    private readonly rmqClient: ClientProxy,
  ) {}

  async execute({ userId, todoId }: ExecuteProps) {
    this.logger.debug(`REMINDER ${userId} - ${todoId}`);

    try {
      const todo = await this.repoRead.getTodoById(todoId);
      if (!todo) {
        this.logger.warn(`Todo with ID ${todoId} not found, skipping reminder event.`);
        return;
      }

      await firstValueFrom(
        this.rmqClient.emit(TodoEventPattern.TodoReminder, {
          todoId,
          userId,
          title: todo.title,
        } satisfies TodoEventPayloadMap[TodoEventPattern.TodoReminder]),
      );
      this.logger.debug(`Successfully published todo.reminder event for todo ${todoId}.`);
    } catch (err) {
      this.logger.error(`Failed to publish todo.reminder event for todo ${todoId}:`, err);
    }
  }
}
