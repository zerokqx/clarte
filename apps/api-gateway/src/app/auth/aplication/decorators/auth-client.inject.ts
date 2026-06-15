import { Fn } from '@clarte/shared-nest';
import { AUTH_CLIENT } from '@/app/auth/aplication/ports';

export const InjectAuthClient = Fn.mkInject(AUTH_CLIENT);

