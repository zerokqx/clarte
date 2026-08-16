import { USER_CLIENT } from '@/application/ports/di-tokens';
import { mkInject } from '@clarte/shared-nest/core/functions';

export const InjectUserClient = mkInject(USER_CLIENT);
