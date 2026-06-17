import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTodoCommand } from './create-todo.command';
import { Todo as TodoProto } from '@clarte/shared-contracts/proto';
import {
  TodoEventPattern,
  TodoEventPayloadMap,
} from '@clarte/shared-event-types/todo';
import { Todo } from '@/domain';
import {
  InjectTodoQueue,
  InjectTodoRepo,
  InjectTodoRmqClient,
} from '@/application/decorators';
import {
  TodoBullMQMapper,
  TodoBullMQPatterns,
  type ITodoWriteRepository,
} from '@/application/ports';
import { randomUUID } from 'crypto';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bullmq';
import { firstValueFrom } from 'rxjs';

@CommandHandler(CreateTodoCommand)
export class CreateTodoHandler implements ICommandHandler<CreateTodoCommand> {
  constructor(
    @InjectTodoRepo('w')
    private readonly repoWrite: ITodoWriteRepository,
    @InjectTodoRmqClient() private readonly rmqClient: ClientProxy,
    @InjectTodoQueue() private readonly timersQueue: Queue,
  ) {}

  async execute(
    command: CreateTodoCommand,
  ): Promise<TodoProto.CreateTodoResponse> {
    const { userId, data } = command;
    const todoId = randomUUID();

    const todo = Todo.create(
      todoId,
      userId,
      false,
      data.title,
      data.description,
      new Date(data.dueDate),
    );
    const delay = todo.dueDate.getTime() - Date.now();

    const finalDelay = delay > 0 ? delay : 0;
    await this.repoWrite.save(todo);
    await Promise.all([
      this.timersQueue.add(
        TodoBullMQPatterns.TodoReminder,
        {
          userId: todo.userId,
          todoId: todo.id,
        } satisfies TodoBullMQMapper[TodoBullMQPatterns.TodoReminder],
        { delay: finalDelay, removeOnComplete: true },
      ),
      firstValueFrom(
        this.rmqClient.emit(TodoEventPattern.TodoCreated, {
          userId: todo.userId,
          todoId: todo.id,
        } satisfies TodoEventPayloadMap[TodoEventPattern.TodoCreated]),
      ),
    ]);

    return { id: todo.id };
  }
}
