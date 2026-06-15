import { mkInject } from '@clarte/shared-nest/functions';
import { JWT_SERVICE } from '@/application/ports';

export const InjectJwtService = mkInject(JWT_SERVICE);
