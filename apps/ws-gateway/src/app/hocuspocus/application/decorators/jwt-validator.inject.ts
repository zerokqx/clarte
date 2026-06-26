import { mkInject } from '@clarte/shared-nest/functions';
import { JWT_VALIDATOR } from '../ports';

export const InjectJwtValidator = mkInject(JWT_VALIDATOR);
