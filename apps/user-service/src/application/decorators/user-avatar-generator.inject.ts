import { USER_AVATAR_GENERATOR } from '@/application/ports';
import { mkInject } from '@clarte/shared-nest/core/functions';

export const InjectUserAvatarGenerator = mkInject(USER_AVATAR_GENERATOR);
