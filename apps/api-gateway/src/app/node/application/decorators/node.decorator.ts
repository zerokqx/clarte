import { mkInject } from '@clarte/shared-nest/functions';
import { NODE_CLIENT, NODE_GRPC_CLIENT } from '../ports/di-tokens';

export const InjectNodeClient = mkInject(NODE_CLIENT);
export const InjectNodeGrpcClient = mkInject(NODE_GRPC_CLIENT);
