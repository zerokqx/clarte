import { USER_CLIENT } from '@/application/ports/di-tokens';
import { Fn } from '@clarte/shared-nest/functions';

export const InjectUserClient = Fn.mkInject(USER_CLIENT);
