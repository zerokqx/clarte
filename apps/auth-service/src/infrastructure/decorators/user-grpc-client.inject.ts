import { USER_GRPC_CLIENT } from '@/infrastructure/ports';
import { Fn } from '@clarte/shared-nest/functions';

export const InjectUserGrpcClient = Fn.mkInject(USER_GRPC_CLIENT);
