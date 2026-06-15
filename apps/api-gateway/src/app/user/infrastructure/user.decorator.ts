import { Fn } from '@clarte/shared-nest/functions';
import { USER_GRPC_CLIENT } from '@/app/user/application';

export const InjectUserGrpcClient = Fn.mkInject(USER_GRPC_CLIENT);
