import { mkInject } from '@clarte/shared-nest/functions';
import { NOTIFICATION_RMQ_CLIENT } from '../ports';

export const InjectNotificationRmqClient = mkInject(NOTIFICATION_RMQ_CLIENT);
