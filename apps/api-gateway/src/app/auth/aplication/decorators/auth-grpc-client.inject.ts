import { Fn } from '@clarte/shared-nest';
import { AUTH_GRPC_CLIENT } from '../ports';

export const InjectAuthGrpcClient = Fn.mkInject(AUTH_GRPC_CLIENT);
