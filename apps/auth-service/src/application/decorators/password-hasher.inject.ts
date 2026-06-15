import { Fn } from '@clarte/shared-nest/functions';
import { PASSWORD_HASHER } from '@/application/ports';

export const InjectPasswordHasher = Fn.mkInject(PASSWORD_HASHER);
