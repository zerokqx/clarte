import { mkInject } from '@clarte/shared-nest/functions';
import { TODO_RMQ_CLIENT } from '../ports';
export const InjectTodoRmqClient = mkInject(TODO_RMQ_CLIENT);
