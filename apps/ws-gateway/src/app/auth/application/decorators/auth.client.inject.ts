import { mkInject } from '@clarte/shared-nest/core/functions';
import { AUTH_CLIENT } from '../ports';

export const InjectAuthClient = mkInject(AUTH_CLIENT);
