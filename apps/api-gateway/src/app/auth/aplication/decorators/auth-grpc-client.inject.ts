import { Fn } from '@clarte/shared-nest/functions';
import { AUTH_GRPC_CLIENT } from '@/app/auth/aplication/ports';

export const InjectAuthGrpcClient = Fn.mkInject(AUTH_GRPC_CLIENT);
