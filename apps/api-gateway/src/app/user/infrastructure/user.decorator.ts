import { mkInject } from '@clarte/shared-nest/functions';
import { USER_GRPC_CLIENT } from '@/app/user/application';

export const InjectUserGrpcClient = mkInject(USER_GRPC_CLIENT);
