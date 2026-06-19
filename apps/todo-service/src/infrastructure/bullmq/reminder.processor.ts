import {
  TODO_BULLMQ_TIMERS,
  TodoBullMQMapper,
  TodoBullMQPatterns,
  TodoReminderService,
} from '@/application';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';

@Injectable()
@Processor(TODO_BULLMQ_TIMERS)
export class ReminderProcessor extends WorkerHost {
  constructor(private readonly todoReminderService: TodoReminderService) {super()}
  override async process(
    job: Job<TodoBullMQMapper[TodoBullMQPatterns.TodoReminder]>,
    token?: string,
  ): Promise<any> {
    this.todoReminderService.execute(job.data);
    return;
  }
}
