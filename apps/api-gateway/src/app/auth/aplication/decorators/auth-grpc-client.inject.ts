import { mkInject } from '@clarte/shared-nest/functions';
import { AUTH_GRPC_CLIENT } from '@/app/auth/aplication/ports';

export const InjectAuthGrpcClient = mkInject(AUTH_GRPC_CLIENT);
