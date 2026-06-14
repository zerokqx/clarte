import { Fn } from '@clarte/shared-nest';
import { JWT_SERVICE } from '../../ports';

export const InjectJwtService = Fn.mkInject(JWT_SERVICE);
