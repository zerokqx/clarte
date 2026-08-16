import { mkInject } from '@clarte/shared-nest/core/functions';
import { AUTH_GRPC_CLIENT } from '../ports';

export const InjectAuthGrpcClient = mkInject(AUTH_GRPC_CLIENT);
