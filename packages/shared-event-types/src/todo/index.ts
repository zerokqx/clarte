
export enum TodoEventPattern {
  TodoCreated = 'todo.todo.event.created',
  TodoUpdated = 'todo.todo.event.updated',
  TodoDeleted = 'todo.todo.event.deleted',
  TodoReminder = 'todo.todo.event.reminder',
}

export interface ITodoDeadlinePayload {
  todoId: string;
  userId: string;
  expectedDueDate: string;
}
export interface ITodoCreatedPayload {
  todoId: string;
  userId: string;
}

export interface ITodoDeletedPayload {
  todoId: string;
  userId: string;
}
export interface ITodoUpdatedPayload {
  todoId: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}
export interface ITodoReminderPayload {
  todoId: string;
  userId: string;
  title: string;
}

export type TodoEventPayloadMap = {
  [TodoEventPattern.TodoCreated]: ITodoCreatedPayload;
  [TodoEventPattern.TodoUpdated]: ITodoUpdatedPayload;
  [TodoEventPattern.TodoDeleted]: ITodoDeletedPayload;
  [TodoEventPattern.TodoReminder]: ITodoReminderPayload;
};

