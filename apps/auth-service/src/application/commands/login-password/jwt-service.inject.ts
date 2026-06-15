import { Fn } from '@clarte/shared-nest/functions';
import { JWT_SERVICE } from '@/application/ports';

export const InjectJwtService = Fn.mkInject(JWT_SERVICE);
