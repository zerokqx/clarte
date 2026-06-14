import { Fn } from '@clarte/shared-nest';
import { AUTH_CLIENT } from '../ports';

export const InjectAuthClient = Fn.mkInject(AUTH_CLIENT);

