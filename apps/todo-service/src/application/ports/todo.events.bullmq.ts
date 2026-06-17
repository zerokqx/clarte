export enum TodoBullMQPatterns {
  TodoReminder = 'todo-reminder',
}

export interface ITodoReminderPayload {
  todoId: string;
  userId: string;
}

export interface TodoBullMQMapper {
  [TodoBullMQPatterns.TodoReminder]: ITodoReminderPayload;
}
