import { AUTH_RMQ_CLIENT } from '@/application/ports/di-tokens';
import { mkInject } from '@clarte/shared-nest/core/functions';

export const InjectAuthRmqClient = mkInject(AUTH_RMQ_CLIENT);
