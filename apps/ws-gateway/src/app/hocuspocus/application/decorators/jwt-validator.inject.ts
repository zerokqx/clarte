import { mkInject } from '@clarte/shared-nest/core/functions';
import { JWT_VALIDATOR } from '../ports';

export const InjectJwtValidator = mkInject(JWT_VALIDATOR);
