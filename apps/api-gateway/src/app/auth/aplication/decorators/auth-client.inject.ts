import { mkInject } from '@clarte/shared-nest/core/functions';
import { AUTH_CLIENT } from '@/app/auth/aplication/ports';

export const InjectAuthClient = mkInject(AUTH_CLIENT);
