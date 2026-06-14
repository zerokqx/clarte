import { Fn } from '@clarte/shared-nest';
import { USER_GRPC_CLIENT } from '../application';

export const InjectUserGrpcClient = Fn.mkInject(USER_GRPC_CLIENT);
