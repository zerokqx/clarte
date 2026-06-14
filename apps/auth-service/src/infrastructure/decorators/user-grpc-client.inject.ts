import { USER_GRPC_CLIENT } from '../ports';
import { Fn } from '@clarte/shared-nest';

export const InjectUserGrpcClient = Fn.mkInject(USER_GRPC_CLIENT);
