import { USER_AVATAR_GENERATOR } from '../ports';
import { Fn } from '@clarte/shared-nest';

export const InjectUserAvatarGenerator = Fn.mkInject(USER_AVATAR_GENERATOR);
