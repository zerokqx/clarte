import { USER_GRPC_CLIENT } from '@/infrastructure/ports';
import { mkInject } from '@clarte/shared-nest/functions';

export const InjectUserGrpcClient = mkInject(USER_GRPC_CLIENT);
