import { mkInject } from '@clarte/shared-nest/functions';
import { PASSWORD_HASHER } from '@/application/ports';

export const InjectPasswordHasher = mkInject(PASSWORD_HASHER);
