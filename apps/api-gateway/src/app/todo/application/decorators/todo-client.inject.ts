import { mkInject } from '@clarte/shared-nest/core/functions';
import { TODO_CLIENT } from '@/app/todo/application/di-tokens';

export const InjectTodoClient = mkInject(TODO_CLIENT);
