import { mkInject } from '@clarte/shared-nest/core/functions';
import { NOTIFICATION_GRPC_CLIENT } from '@/app/notification/application';

export const InjectNotificationGrpcClient = mkInject(NOTIFICATION_GRPC_CLIENT);
