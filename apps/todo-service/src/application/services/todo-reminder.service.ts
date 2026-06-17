import { Injectable, Logger } from '@nestjs/common';

interface ExecuteProps {
  userId: string;
  todoId: string;
}

@Injectable()
export class TodoReminderService {
  private readonly logger = new Logger(TodoReminderService.name);
  execute({ userId, todoId }: ExecuteProps) {
    this.logger.debug(`REMINDER ${userId} - ${todoId}`);
  }
}
