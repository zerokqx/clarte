import { Fn } from '@clarte/shared-nest';
import { PASSWORD_HASHER } from '../ports';

export const InjectPasswordHasher = Fn.mkInject(PASSWORD_HASHER);
