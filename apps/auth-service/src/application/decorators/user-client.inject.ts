import { USER_CLIENT } from '../ports/di-tokens';
import { Fn } from '@clarte/shared-nest';

export const InjectUserClient = Fn.mkInject(USER_CLIENT);
