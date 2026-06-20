import { InjectQueue } from '@nestjs/bullmq';
import { TODO_BULLMQ_TIMERS } from '../ports';

export const InjectTodoQueue = () => InjectQueue(TODO_BULLMQ_TIMERS);
