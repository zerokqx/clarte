import { mkInject } from '@clarte/shared-nest/core/functions';
import { TODO_GRPC_CLIENT } from '@/app/todo/application/di-tokens';

export const InjectTodoGrpcClient = mkInject(TODO_GRPC_CLIENT);
