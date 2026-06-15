import { USER_AVATAR_GENERATOR } from '@/application/ports';
import { Fn } from '@clarte/shared-nest/functions';

export const InjectUserAvatarGenerator = Fn.mkInject(USER_AVATAR_GENERATOR);
